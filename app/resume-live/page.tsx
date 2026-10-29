import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "CV", robots: { index: false } };

// The old /resume-live/ page moved to /cv/.
export default function ResumeLive() {
    return (
        <main id="main" className="page">
            <meta httpEquiv="refresh" content="0; url=/hitesh-engineering/cv/" />
            <p>
                This page moved to <Link href="/cv/">/cv/</Link>.
            </p>
        </main>
    );
}
