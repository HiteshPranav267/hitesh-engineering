import type { Metadata } from "next";
import Link from "next/link";
import BackToRoom from "@/components/BackToRoom";
import LibraryList from "@/components/LibraryList";
import { getLibrary } from "@/lib/content";

export const metadata: Metadata = { title: "Library" };

export default function LibraryPage() {
    const items = getLibrary();
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>Library</h1>
            <p className="meta" style={{ marginTop: "0.6rem" }}>
                Every note, slide deck, question bank, code repository and study site in one list — mine and other people&apos;s. Handwritten notes open in the{" "}
                <Link href="/notes/">reader</Link>.
            </p>
            <LibraryList items={items} />
        </main>
    );
}
