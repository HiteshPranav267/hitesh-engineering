import type { Metadata } from "next";
import Link from "next/link";
import BackToRoom from "@/components/BackToRoom";
import NotesSearch from "@/components/NotesSearch";
import { getNotes } from "@/lib/content";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "Notes" };

const YEARS: Record<number, string> = { 1: "First year", 2: "Second year", 3: "Third year", 4: "Fourth year" };

export default function NotesPage() {
    const subjects = getNotes();
    const years = [...new Set(subjects.map((s) => s.year))].sort();
    const total = subjects.reduce((n, s) => n + s.pages, 0);
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>Handwritten notes</h1>
            <p className="meta" style={{ marginTop: "0.6rem" }}>
                {subjects.length} subjects · {total} pages · <Link href="/desk/">All subjects on one desk</Link> · <Link href="/library/">Library: slides, question banks, PYQs and more</Link> · <Link href="/field-notes/">RTL Field Notes</Link>
            </p>
            <p className="meta">
                <span className="dept dept-SH" />
                S&amp;H <span className="dept dept-ECE" style={{ marginLeft: "0.8rem" }} />
                ECE <span className="dept dept-CSE" style={{ marginLeft: "0.8rem" }} />
                CSE
            </p>
            <NotesSearch />
            {years.map((y) => (
                <section key={y} className="shelf-year" aria-labelledby={`y${y}`}>
                    <h2 id={`y${y}`}>{YEARS[y]}</h2>
                    <ul className="subject-list">
                        {subjects
                            .filter((s) => s.year === y)
                            .map((s) => (
                                <li key={s.slug}>
                                    <img src={asset(s.cover)} alt="" width={52} height={70} loading="lazy" />
                                    <div>
                                        <Link className="entry-title" href={`/notes/${s.slug}/`}>
                                            {s.subject}
                                        </Link>
                                        <div className="meta">
                                            <span className={`dept dept-${s.department.replace("&", "")}`} />
                                            {s.department}
                                            {s.semester ? ` · Semester ${s.semester}` : ""} · {s.files.length} {s.files.length === 1 ? "unit" : "units"}
                                        </div>
                                    </div>
                                    <span className="meta">
                                        {s.pages} pp. · <Link href={`/desk/${s.slug}/`}>Desk</Link>
                                    </span>
                                </li>
                            ))}
                    </ul>
                </section>
            ))}
        </main>
    );
}
