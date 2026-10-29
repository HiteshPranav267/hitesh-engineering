import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Room", robots: { index: false } };

// The room is now the home page; keep old /room/ links working.
export default function OldRoom() {
    return (
        <main id="main" className="page">
            <meta httpEquiv="refresh" content="0; url=/hitesh-engineering/" />
            <p>
                The room moved to the <Link href="/">home page</Link>.
            </p>
        </main>
    );
}
