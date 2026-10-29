"use client";

import { useEffect, useRef, useState } from "react";
import type OpenSeadragonType from "openseadragon";
import { openPdf, type PdfDoc } from "@/lib/pdf";
import { asset, NOTES_PDF_BASE } from "@/lib/site";

interface Item {
    subject?: string;
    file: string;
    page: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Layout {
    width: number;
    height: number;
    scale?: number; // desk-image px -> layout px (the committed desks are 1/4 size)
    items: Item[];
}

/**
 * Full-resolution desks (with the top zoom levels) once they are on R2; until then the
 * committed reduced desks in public/notes-desk, with close-ups drawn from the PDFs.
 */
const FULL_BASE = process.env.NEXT_PUBLIC_NOTES_ASSETS_BASE;
const DESK_BASE = FULL_BASE ? `${FULL_BASE}/desk` : asset("notes-desk");

const CLOSEUP_MIN_PX = 260; // start drawing pages from the PDF once one is this wide on screen
const CLOSEUP_MAX = 8; // pages drawn at once
const CLOSEUP_MAX_W = 1800; // canvas width cap per page

/**
 * The Infinite Desk: one deep-zoom image per subject (or every subject for "shelf").
 * Zoomed out shows subject and unit names, mid shows page thumbnails, in shows handwriting.
 */
export default function Desk({ name, subject, pdfs }: { name: string; subject?: string; pdfs: Record<string, string> }) {
    const host = useRef<HTMLDivElement>(null);
    const viewer = useRef<OpenSeadragonType.Viewer | null>(null);
    const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
    const [hover, setHover] = useState<Item | null>(null);

    useEffect(() => {
        let destroyed = false;
        const docs = new Map<string, Promise<PdfDoc>>();
        const shown = new Map<string, { el: HTMLCanvasElement; width: number }>();
        (async () => {
            let layout: Layout;
            try {
                const res = await fetch(`${DESK_BASE}/${name}.json`);
                if (!res.ok) throw new Error();
                layout = await res.json();
            } catch {
                if (!destroyed) setState("missing");
                return;
            }
            const k = layout.scale ?? 1;
            const OSD = (await import("openseadragon")).default;
            if (destroyed || !host.current) return;
            const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
            const v = OSD({
                element: host.current,
                tileSources: `${DESK_BASE}/${name}.dzi`,
                showNavigationControl: false,
                gestureSettingsMouse: { clickToZoom: false },
                animationTime: reduce ? 0 : 0.9,
                springStiffness: 9,
                visibilityRatio: 0.6,
                // The PDF close-ups carry the detail, so allow zooming past the tiles.
                maxZoomPixelRatio: FULL_BASE ? 1.6 : 1.6 * k,
                immediateRender: reduce,
            });
            viewer.current = v;
            const rectOf = (it: Item) => v.viewport.imageToViewportRectangle(it.x / k, it.y / k, it.w / k, it.h / k);
            const find = (pt: OpenSeadragonType.Point) => {
                const img = v.viewport.viewportToImageCoordinates(pt);
                const x = img.x * k;
                const y = img.y * k;
                return layout.items.find((it) => x >= it.x && x <= it.x + it.w && y >= it.y && y <= it.y + it.h) ?? null;
            };
            const keyOf = (it: Item) => `${it.subject ?? subject}/${it.file}/${it.page}`;

            const docFor = (it: Item) => {
                const pdf = pdfs[`${it.subject ?? subject}/${it.file}`];
                if (!pdf) return null;
                const url = `${NOTES_PDF_BASE}/${pdf}`;
                if (!docs.has(url)) docs.set(url, openPdf(url));
                return docs.get(url)!;
            };

            // Draw a page into a canvas shaped like its desk cell, centred on white (as build.py does).
            const drawPage = async (it: Item, width: number) => {
                const doc = await docFor(it);
                if (!doc) return null;
                const page = await doc.getPage(it.page);
                const cell = document.createElement("canvas");
                cell.width = Math.round(width);
                cell.height = Math.round((width * it.h) / it.w);
                const base = page.getViewport({ scale: 1 });
                const s = Math.min(cell.width / base.width, cell.height / base.height);
                const vp = page.getViewport({ scale: s });
                const tmp = document.createElement("canvas");
                tmp.width = Math.ceil(vp.width);
                tmp.height = Math.ceil(vp.height);
                await page.render({ canvasContext: tmp.getContext("2d")!, viewport: vp }).promise;
                const ctx = cell.getContext("2d")!;
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, cell.width, cell.height);
                ctx.drawImage(tmp, (cell.width - tmp.width) / 2, (cell.height - tmp.height) / 2);
                cell.style.pointerEvents = "none";
                return cell;
            };

            let pending = 0;
            const refresh = async () => {
                const run = ++pending;
                const bounds = v.viewport.getBounds(true);
                const containerW = v.container.clientWidth;
                const visible = layout.items
                    .map((it) => ({ it, r: rectOf(it) }))
                    .filter(({ r }) => r.x < bounds.x + bounds.width && r.x + r.width > bounds.x && r.y < bounds.y + bounds.height && r.y + r.height > bounds.y);
                const pagePx = visible.length ? (visible[0].r.width / bounds.width) * containerW : 0;
                const want = pagePx >= CLOSEUP_MIN_PX ? visible.slice(0, CLOSEUP_MAX) : [];
                const wantKeys = new Set(want.map(({ it }) => keyOf(it)));
                for (const [key, o] of shown) {
                    if (!wantKeys.has(key)) {
                        v.removeOverlay(o.el);
                        shown.delete(key);
                    }
                }
                const width = Math.min(CLOSEUP_MAX_W, pagePx * (window.devicePixelRatio || 1));
                for (const { it, r } of want) {
                    const key = keyOf(it);
                    const have = shown.get(key);
                    if (have && have.width >= width * 0.8) continue;
                    const el = await drawPage(it, width).catch(() => null);
                    if (!el || destroyed || run !== pending) return;
                    if (have) v.removeOverlay(have.el);
                    v.addOverlay({ element: el, location: r });
                    shown.set(key, { el, width });
                }
            };

            v.addHandler("canvas-click", (e) => {
                if (!e.quick) return;
                const it = find(v.viewport.pointFromPixel(e.position));
                if (!it) return;
                const s = it.subject ?? subject;
                window.location.href = asset(`notes/${s}/?u=${encodeURIComponent(it.file)}#p${it.page}`);
            });
            new OSD.MouseTracker({
                element: v.canvas,
                moveHandler: (e) => setHover(find(v.viewport.pointFromPixel((e as unknown as { position: OpenSeadragonType.Point }).position))),
            });
            v.addHandler("animation-finish", () => void refresh());
            v.addOnceHandler("open", () => !destroyed && setState("ready"));
            v.addHandler("open-failed", () => !destroyed && setState("missing"));
        })();
        return () => {
            destroyed = true;
            viewer.current?.destroy();
            viewer.current = null;
            docs.forEach((d) => d.then((x) => x.destroy()).catch(() => {}));
        };
    }, [name, subject, pdfs]);

    const zoom = (f: number) => {
        const v = viewer.current;
        if (v) v.viewport.zoomBy(f).applyConstraints();
    };

    return (
        <div>
            <div className="reader-tools no-print" style={{ marginTop: "1rem" }}>
                <button type="button" className="text-button" onClick={() => zoom(1.6)}>
                    Zoom in
                </button>
                <button type="button" className="text-button" onClick={() => zoom(1 / 1.6)}>
                    Zoom out
                </button>
                <button type="button" className="text-button" onClick={() => viewer.current?.viewport.goHome()}>
                    Whole desk
                </button>
                <span className="meta" aria-live="polite">
                    {hover ? `${hover.subject ? hover.subject + " · " : ""}${hover.file} · page ${hover.page} — click to read` : "Scroll or pinch to zoom, drag to move, click a page to open it"}
                </span>
            </div>
            <div ref={host} className="desk" role="application" aria-label="Notes desk. Use the buttons above or the list view to open pages." />
            {state === "missing" && (
                <p className="desk-note">
                    This desk could not be loaded. Read the notes in the <a href={asset(subject ? `notes/${subject}/` : "notes/")}>list view</a>.
                </p>
            )}
        </div>
    );
}
