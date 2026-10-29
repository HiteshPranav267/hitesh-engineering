import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackToRoom from "@/components/BackToRoom";
import NotesReader from "@/components/NotesReader";
import { getNotes } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
    return getNotes().map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
    const { subject } = await params;
    const s = getNotes().find((x) => x.slug === subject);
    return { title: s ? `${s.subject} notes` : "Notes" };
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
    const { subject } = await params;
    const s = getNotes().find((x) => x.slug === subject);
    if (!s) notFound();
    const revised = s.files.map((f) => f.revised).sort().at(-1);
    return (
        <main id="main" className="page">
            <BackToRoom />
            <div data-pagefind-body>
                <p className="meta">
                    <Link href="/notes/">Notes</Link> · Year {s.year}
                    {s.semester ? `, semester ${s.semester}` : ""} · {s.department}
                </p>
                <h1 style={{ marginTop: "0.4rem" }} data-pagefind-meta="title">
                    {s.subject}
                </h1>
                <p className="meta">
                    {s.pages} handwritten pages · last revised {revised} · <Link href={`/desk/${s.slug}/`}>Spread on the desk</Link>
                </p>
                <div className="sr-only">
                    {s.files.map((f) => (
                        <p key={f.stem}>
                            {f.unit}. {f.topics.map((t) => t.name).join(". ")}
                        </p>
                    ))}
                </div>
            </div>
            <NotesReader files={s.files} />
        </main>
    );
}
