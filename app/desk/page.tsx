import type { Metadata } from "next";
import Link from "next/link";
import BackToRoom from "@/components/BackToRoom";
import Desk from "@/components/Desk";
import { getNotes } from "@/lib/content";

export const metadata: Metadata = { title: "The whole shelf on one desk" };

export default function ShelfDesk() {
    const pdfs = Object.fromEntries(getNotes().flatMap((s) => s.files.map((f) => [`${s.slug}/${f.stem}`, f.pdf])));
    return (
        <main id="main" className="page">
            <BackToRoom />
            <p className="meta">
                <Link href="/notes/">Notes</Link>
            </p>
            <h1 style={{ marginTop: "0.4rem" }}>Every subject on one desk</h1>
            <Desk name="shelf" pdfs={pdfs} />
        </main>
    );
}
