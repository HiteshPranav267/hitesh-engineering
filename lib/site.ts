export const BASE = "/hitesh-engineering";

/** Prefix a site-relative path with the GitHub Pages basePath (for plain <a>, <img>, fetch). */
export function asset(path: string): string {
    return `${BASE}/${path.replace(/^\//, "")}`;
}

/** Where note PDFs live. Today: public/notes (deployed). After R2: set NEXT_PUBLIC_NOTES_PDF_BASE. */
export const NOTES_PDF_BASE = process.env.NEXT_PUBLIC_NOTES_PDF_BASE || asset("notes");

/** Where thumbnails and deep-zoom tiles live. Today: public/notes-dev (local only). After R2: set NEXT_PUBLIC_NOTES_ASSETS_BASE. */
export const NOTES_ASSETS_BASE = process.env.NEXT_PUBLIC_NOTES_ASSETS_BASE || asset("notes-dev");

export const SITE_URL = "https://hiteshpranav267.github.io/hitesh-engineering";
