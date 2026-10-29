"use client";

import { asset } from "./site";

export type PdfDoc = import("pdfjs-dist").PDFDocumentProxy;

let pdfjs: Promise<typeof import("pdfjs-dist")> | null = null;

export function loadPdfjs() {
    pdfjs ??= import("pdfjs-dist").then((m) => {
        m.GlobalWorkerOptions.workerSrc = asset("vendor/pdf.worker.min.mjs");
        return m;
    });
    return pdfjs;
}

/** Open a PDF with range requests, so only the pages that are drawn get downloaded. */
export async function openPdf(url: string): Promise<PdfDoc> {
    const m = await loadPdfjs();
    return m.getDocument({ url, disableAutoFetch: true }).promise;
}
