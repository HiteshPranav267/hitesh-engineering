import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackToRoom from "@/components/BackToRoom";
import Desk from "@/components/Desk";
import { getNotes } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
    return getNotes().map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
    const { subject } = await params;
    const s = getNotes().find((x) => x.slug === subject);
    return { title: s ? `${s.subject} on the desk` : "Desk" };
}

export default async function SubjectDesk({ params }: { params: Promise<{ subject: string }> }) {
    const { subject } = await params;
    const s = getNotes().find((x) => x.slug === subject);
    if (!s) notFound();
    return (
        <main id="main" className="page">
            <BackToRoom />
            <p className="meta">
                <Link href="/notes/">Notes</Link> · <Link href={`/notes/${s.slug}/`}>{s.subject} in the reader</Link> · <Link href="/desk/">Whole shelf</Link>
            </p>
            <h1 style={{ marginTop: "0.4rem" }}>{s.subject}</h1>
            <Desk name={s.slug} subject={s.slug} />
        </main>
    );
}
