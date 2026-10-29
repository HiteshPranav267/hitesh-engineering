"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { replaceUrl, safeStorage, setStorage, useBrowserValue, useLocation } from "@/lib/browser";
import type { NoteFile } from "@/lib/content";
import { asset, NOTES_PDF_BASE } from "@/lib/site";

type PdfDoc = import("pdfjs-dist").PDFDocumentProxy;

async function loadPdfjs() {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = asset("vendor/pdf.worker.min.mjs");
    return pdfjs;
}

function parseLocation(loc: string): { unit: string | null; page: number } {
    const [search, hash = ""] = loc.split("#");
    const m = /^p(d+)$/.exec(hash);
    return { unit: new URLSearchParams(search).get("u"), page: m ? Number(m[1]) : 1 };
}

function Thumb({ doc, n, current, onPick }: { doc: PdfDoc; n: number; current: boolean; onPick: (n: number) => void }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const btn = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const el = btn.current;
        if (!el) return;
        let done = false;
        const io = new IntersectionObserver(async ([e]) => {
            if (!e.isIntersecting || done) return;
            done = true;
            io.disconnect();
            const page = await doc.getPage(n);
            const vp = page.getViewport({ scale: 1 });
            const scale = 160 / vp.width;
            const v = page.getViewport({ scale });
            const c = ref.current!;
            c.width = v.width;
            c.height = v.height;
            await page.render({ canvasContext: c.getContext("2d")!, viewport: v }).promise;
        }, { rootMargin: "400px" });
        io.observe(el);
        return () => io.disconnect();
    }, [doc, n]);
    useEffect(() => {
        if (current) btn.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [current]);
    return (
        <button ref={btn} type="button" aria-current={current} aria-label={`Page ${n}`} onClick={() => onPick(n)}>
            <canvas ref={ref} width={160} height={226} />
            <span>{n}</span>
        </button>
    );
}

export default function NotesReader({ files }: { files: NoteFile[] }) {
    const loc = parseLocation(useLocation());
    const fileIdx = Math.max(0, files.findIndex((f) => f.stem === loc.unit));
    const file = files[fileIdx];
    const page = loc.page;
    const url = `${NOTES_PDF_BASE}/${file.pdf}`;
    const inverted = useBrowserValue(["storagechange"], () => safeStorage("local", "reader-invert") === "1", false);
    const [loaded, setLoaded] = useState<{ url: string; doc?: PdfDoc; error?: string } | null>(null);
    const doc = loaded?.url === url ? (loaded.doc ?? null) : null;
    const error = loaded?.url === url ? loaded.error : undefined;
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let cancelled = false;
        let d: PdfDoc | null = null;
        loadPdfjs()
            .then((pdfjs) => pdfjs.getDocument({ url, disableAutoFetch: true }).promise)
            .then((x) => {
                d = x;
                if (!cancelled) setLoaded({ url, doc: x });
            })
            .catch(() => !cancelled && setLoaded({ url, error: "This PDF could not be loaded." }));
        return () => {
            cancelled = true;
            d?.destroy();
        };
    }, [url]);

    useEffect(() => {
        if (!doc || !canvas.current) return;
        const n = Math.min(Math.max(page, 1), doc.numPages);
        let task: { cancel: () => void } | null = null;
        doc.getPage(n).then((pg) => {
            const c = canvas.current;
            if (!c) return;
            const width = c.parentElement!.clientWidth * (window.devicePixelRatio || 1);
            const vp = pg.getViewport({ scale: width / pg.getViewport({ scale: 1 }).width });
            c.width = vp.width;
            c.height = vp.height;
            const r = pg.render({ canvasContext: c.getContext("2d")!, viewport: vp });
            task = r;
            r.promise.catch(() => {});
        });
        return () => task?.cancel();
    }, [doc, page]);

    const go = useCallback(
        (n: number) => {
            const max = doc?.numPages ?? file.pages;
            replaceUrl(`?u=${file.stem}#p${Math.min(Math.max(n, 1), max)}`);
        },
        [doc, file],
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).closest("input, select, textarea")) return;
            if (e.key === "ArrowRight") go(page + 1);
            if (e.key === "ArrowLeft") go(page - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, page]);

    const pickFile = (i: number) => replaceUrl(`?u=${files[i].stem}#p1`);
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
                    Page {page} of {doc?.numPages ?? file.pages} · revised {file.revised}
                </span>
                <button type="button" className="text-button" onClick={() => go(page - 1)} disabled={page <= 1}>
                    ← Prev
                </button>
                <button type="button" className="text-button" onClick={() => go(page + 1)}>
                    Next →
                </button>
                <button type="button" className="text-button" onClick={toggleInvert} aria-pressed={inverted}>
                    Night pages: {inverted ? "on" : "off"}
                </button>
                <a className="text-button" href={url} download>
                    Download
                </a>
                <a className="text-button" href={url} target="_blank" rel="noopener">
                    Open to print
                </a>
            </div>
            <div className={`reader${inverted ? " inverted" : ""}`}>
                <div className="reader-strip" aria-label="Pages">
                    {doc && Array.from({ length: doc.numPages }, (_, i) => <Thumb key={`${file.stem}-${i}`} doc={doc} n={i + 1} current={page === i + 1} onPick={go} />)}
                </div>
                <div className="reader-page">
                    {error ? <p style={{ padding: "1rem" }}>{error}</p> : <canvas ref={canvas} aria-label={`${file.unit}, page ${page}`} />}
                </div>
                <div className="topic-index">
                    <p className="meta">Topics in this unit</p>
                    {file.topics.length === 0 ? (
                        <p className="meta">Not indexed yet.</p>
                    ) : (
                        <ol>
                            {file.topics.map((t) => (
                                <li key={`${t.name}-${t.page}`}>
                                    <a href={`?u=${file.stem}#p${t.page}`} onClick={(e) => { e.preventDefault(); go(t.page); }}>
                                        {t.name}
                                    </a>{" "}
                                    <span className="meta">p. {t.page}</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
}
