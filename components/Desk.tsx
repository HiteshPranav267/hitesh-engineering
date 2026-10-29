"use client";

import { useEffect, useRef, useState } from "react";
import type OpenSeadragonType from "openseadragon";
import { asset, NOTES_ASSETS_BASE } from "@/lib/site";

interface Item {
    subject?: string;
    file: string;
    page: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * The Infinite Desk: one deep-zoom image per subject (or every subject for "shelf").
 * Zoomed out shows subject and unit names, mid shows page thumbnails, in shows handwriting.
 */
export default function Desk({ name, subject }: { name: string; subject?: string }) {
    const host = useRef<HTMLDivElement>(null);
    const viewer = useRef<OpenSeadragonType.Viewer | null>(null);
    const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
    const [hover, setHover] = useState<Item | null>(null);

    useEffect(() => {
        let destroyed = false;
        (async () => {
            const base = `${NOTES_ASSETS_BASE}/desk/${name}`;
            let layout: { width: number; items: Item[] };
            try {
                const res = await fetch(`${base}.json`);
                if (!res.ok) throw new Error();
                layout = await res.json();
            } catch {
                if (!destroyed) setState("missing");
                return;
            }
            const OSD = (await import("openseadragon")).default;
            if (destroyed || !host.current) return;
            const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
            const v = OSD({
                element: host.current,
                tileSources: `${base}.dzi`,
                showNavigationControl: false,
                gestureSettingsMouse: { clickToZoom: false },
                animationTime: reduce ? 0 : 0.9,
                springStiffness: 9,
                visibilityRatio: 0.6,
                maxZoomPixelRatio: 1.6,
                immediateRender: reduce,
            });
            viewer.current = v;
            const find = (pt: OpenSeadragonType.Point) => {
                const img = v.viewport.viewportToImageCoordinates(pt);
                return layout.items.find((it) => img.x >= it.x && img.x <= it.x + it.w && img.y >= it.y && img.y <= it.y + it.h) ?? null;
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
            v.addOnceHandler("open", () => !destroyed && setState("ready"));
            v.addHandler("open-failed", () => !destroyed && setState("missing"));
        })();
        return () => {
            destroyed = true;
            viewer.current?.destroy();
            viewer.current = null;
        };
    }, [name, subject]);

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
                    The desk tiles for these notes are not uploaded yet. Read them in the <a href={asset(subject ? `notes/${subject}/` : "notes/")}>list view</a>.
                </p>
            )}
        </div>
    );
}
