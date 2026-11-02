"use client";

import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { replaceUrl, safeStorage, setStorage, useBrowserValue, useLocation } from "@/lib/browser";
import type { NoteFile } from "@/lib/content";
import { openPdf, type PdfDoc } from "@/lib/pdf";
import { NOTES_PDF_BASE } from "@/lib/site";

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const PAD = 12; // px around the page column inside the viewer

function parseLocation(loc: string): { unit: string | null; page: number } {
    const [search, hash = ""] = loc.split("#");
    const m = /^p(\d+)$/.exec(hash);
    return { unit: new URLSearchParams(search).get("u"), page: m ? Number(m[1]) : 1 };
}

/** One page of the scroll. Draws itself only while near the viewport, and frees the canvas when it scrolls away. */
function Page({ doc, n, width, ratio, root }: { doc: PdfDoc; n: number; width: number; ratio: number; root: RefObject<HTMLDivElement | null> }) {
    const box = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [near, setNear] = useState(false);
    const [own, setOwn] = useState<number | null>(null);

    useEffect(() => {
        const el = box.current;
        if (!el || !root.current) return;
        const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { root: root.current, rootMargin: "150% 0px" });
        io.observe(el);
        return () => io.disconnect();
    }, [root]);

    useEffect(() => {
        const c = canvas.current;
        if (!c) return;
        if (!near || !width) {
            c.width = 0;
            c.height = 0;
            return;
        }
        let cancelled = false;
        let task: { cancel: () => void } | null = null;
        doc.getPage(n).then((pg) => {
            if (cancelled) return;
            const base = pg.getViewport({ scale: 1 });
            setOwn(base.height / base.width);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const vp = pg.getViewport({ scale: (width * dpr) / base.width });
            c.width = vp.width;
            c.height = vp.height;
            const r = pg.render({ canvasContext: c.getContext("2d")!, viewport: vp });
            task = r;
            r.promise.catch(() => {});
        });
        return () => {
            cancelled = true;
            task?.cancel();
        };
    }, [doc, n, width, near]);

    return (
        <div ref={box} className="pdf-page" data-page={n} style={{ width, height: Math.round(width * (own ?? ratio)) }}>
            <canvas ref={canvas} aria-label={`Page ${n}`} />
        </div>
    );
}

export default function NotesReader({ files }: { files: NoteFile[] }) {
    const loc = parseLocation(useLocation());
    const fileIdx = Math.max(0, files.findIndex((f) => f.stem === loc.unit));
    const file = files[fileIdx];
    const url = `${NOTES_PDF_BASE}/${file.pdf}`;
    const inverted = useBrowserValue(["storagechange"], () => safeStorage("local", "reader-invert") === "1", false);
    const [loaded, setLoaded] = useState<{ url: string; doc?: PdfDoc; ratio?: number; error?: string } | null>(null);
    const doc = loaded?.url === url ? (loaded.doc ?? null) : null;
    const ratio = loaded?.url === url ? (loaded.ratio ?? Math.SQRT2) : Math.SQRT2;
    const error = loaded?.url === url ? loaded.error : undefined;
    const total = doc?.numPages ?? file.pages;

    const scroller = useRef<HTMLDivElement>(null);
    const [fit, setFit] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [current, setCurrent] = useState(1);
    const width = Math.floor(fit * zoom);
    const keep = useRef<number | null>(null); // scroll fraction to restore after a zoom
    const jumped = useRef<string | null>(null); // the PDF whose starting page has been scrolled to

    useEffect(() => {
        let cancelled = false;
        let d: PdfDoc | null = null;
        openPdf(url)
            .then(async (x) => {
                d = x;
                const vp = (await x.getPage(1)).getViewport({ scale: 1 });
                if (!cancelled) setLoaded({ url, doc: x, ratio: vp.height / vp.width });
            })
            .catch(() => !cancelled && setLoaded({ url, error: "This PDF could not be loaded." }));
        return () => {
            cancelled = true;
            d?.destroy();
        };
    }, [url]);

    // Fit-to-width follows the viewer's size.
    useEffect(() => {
        const el = scroller.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setFit(Math.max(200, Math.min(el.clientWidth - PAD * 2, 1100))));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const scrollToPage = useCallback((n: number) => {
        const box = scroller.current;
        const el = box?.querySelector<HTMLElement>(`[data-page="${n}"]`);
        if (box && el) box.scrollTop = el.offsetTop - PAD;
    }, []);

    const go = useCallback(
        (n: number) => {
            const p = Math.min(Math.max(n, 1), total);
            scrollToPage(p);
            setCurrent(p);
            history.replaceState(null, "", `?u=${file.stem}#p${p}`);
        },
        [scrollToPage, total, file],
    );

    // Open at the page named in the URL, once per PDF.
    useEffect(() => {
        if (!doc || !width || jumped.current === url) return;
        jumped.current = url;
        scrollToPage(Math.min(Math.max(loc.page, 1), doc.numPages));
    }, [doc, width, url, loc.page, scrollToPage]);

    // Keep the same place in the document across a zoom.
    useLayoutEffect(() => {
        const box = scroller.current;
        if (!box || keep.current === null) return;
        box.scrollTop = keep.current * box.scrollHeight;
        box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
        keep.current = null;
    }, [width]);

    const onScroll = () => {
        const box = scroller.current;
        if (!box) return;
        const mark = box.scrollTop + box.clientHeight / 3;
        let n = 1;
        for (const el of box.querySelectorAll<HTMLElement>("[data-page]")) {
            if (el.offsetTop > mark) break;
            n = Number(el.dataset.page);
        }
        if (n !== current) {
            setCurrent(n);
            history.replaceState(null, "", `?u=${file.stem}#p${n}`);
        }
    };

    useEffect(() => {
        const onHash = () => go(parseLocation(location.search + location.hash).page);
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, [go]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).closest("input, select, textarea")) return;
            if (e.key === "ArrowRight") go(current + 1);
            if (e.key === "ArrowLeft") go(current - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, current]);

    const setZoomKeep = (z: number) => {
        const box = scroller.current;
        if (box) keep.current = box.scrollTop / box.scrollHeight;
        setZoom(z);
    };
    const zoomStep = (dir: 1 | -1) => {
        const i = ZOOMS.indexOf(zoom) + dir;
        if (i >= 0 && i < ZOOMS.length) setZoomKeep(ZOOMS[i]);
    };
    const pickFile = (i: number) => {
        setCurrent(1);
        if (scroller.current) scroller.current.scrollTop = 0;
        replaceUrl(`?u=${files[i].stem}#p1`);
    };
    const toggleInvert = () => setStorage("local", "reader-invert", inverted ? "0" : "1");

    return (
        <div>
            <div className="reader-tools">
                <label>
                    <span className="meta">Unit </span>
                    <select value={fileIdx} onChange={(e) => pickFile(Number(e.target.value))}>
                        {files.map((f, i) => (
                            <option key={f.stem} value={i}>
                                {f.unit} ({f.pages} pp.)
                            </option>
                        ))}
                    </select>
                </label>
                <span className="meta">
                    <label>
                        Page{" "}
                        <input
                            key={current}
                            type="number"
                            min={1}
                            max={total}
                            defaultValue={current}
                            aria-label="Go to page"
                            onKeyDown={(e) => e.key === "Enter" && go(Number(e.currentTarget.value))}
                            onBlur={(e) => Number(e.target.value) !== current && go(Number(e.target.value))}
                        />
                    </label>{" "}
                    of {total} · revised {file.revised}
                </span>
                <span className="reader-zoom">
                    <button type="button" className="tool-button" onClick={() => zoomStep(-1)} disabled={zoom <= ZOOMS[0]} aria-label="Zoom out">
                        −
                    </button>
                    <button type="button" className="tool-button" onClick={() => setZoomKeep(1)} title="Fit to width">
                        {Math.round(zoom * 100)}%
                    </button>
                    <button type="button" className="tool-button" onClick={() => zoomStep(1)} disabled={zoom >= ZOOMS.at(-1)!} aria-label="Zoom in">
                        +
                    </button>
                </span>
                <button type="button" className="tool-button" onClick={toggleInvert} aria-pressed={inverted}>
                    Night pages: {inverted ? "on" : "off"}
                </button>
                <a className="tool-button" href={url} download>
                    Download
                </a>
                <a className="tool-button" href={url} target="_blank" rel="noopener">
                    Open in new tab
                </a>
            </div>
            <div className={`reader${file.topics.length ? " with-topics" : ""}`}>
                <div
                    ref={scroller}
                    className={`pdf-viewer${inverted ? " inverted" : ""}`}
                    tabIndex={0}
                    aria-label={`${file.unit}, ${total} pages`}
                    onScroll={onScroll}
                >
                    {error ? (
                        <p className="pdf-error">{error}</p>
                    ) : doc && width ? (
                        Array.from({ length: doc.numPages }, (_, i) => (
                            <Page key={`${url}-${i}`} doc={doc} n={i + 1} width={width} ratio={ratio} root={scroller} />
                        ))
                    ) : (
                        <p className="pdf-error">Loading…</p>
                    )}
                </div>
                {file.topics.length > 0 && (
                    <div className="topic-index">
                        <p className="meta">Topics in this unit</p>
                        <ol>
                            {file.topics.map((t) => (
                                <li key={`${t.name}-${t.page}`}>
                                    <a
                                        href={`?u=${file.stem}#p${t.page}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            go(t.page);
                                        }}
                                    >
                                        {t.name}
                                    </a>{" "}
                                    <span className="meta">p. {t.page}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}
