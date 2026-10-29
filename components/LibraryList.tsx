"use client";

import { useMemo, useState } from "react";
import type { LibraryItem } from "@/lib/content";
import { asset } from "@/lib/site";

const YEARS: Record<number, string> = { 1: "First year", 2: "Second year", 3: "Third year", 4: "Fourth year" };

export default function LibraryList({ items }: { items: LibraryItem[] }) {
    const [q, setQ] = useState("");
    const [year, setYear] = useState("all");
    const [kind, setKind] = useState("all");
    const [by, setBy] = useState("all");
    const kinds = useMemo(() => [...new Set(items.map((i) => i.kind))].sort(), [items]);
    const years = useMemo(() => [...new Set(items.map((i) => i.year))].sort(), [items]);

    const shown = items.filter((i) => {
        if (year !== "all" && String(i.year) !== year) return false;
        if (kind !== "all" && i.kind !== kind) return false;
        if (by !== "all" && i.by !== by) return false;
        const t = q.trim().toLowerCase();
        return !t || `${i.title} ${i.subject} ${i.kind}`.toLowerCase().includes(t);
    });

    const groups = years
        .map((y) => {
            const inYear = shown.filter((i) => i.year === y);
            const subjects = [...new Set(inYear.map((i) => i.subject))];
            return { y, subjects: subjects.map((s) => ({ s, rows: inYear.filter((i) => i.subject === s) })) };
        })
        .filter((g) => g.subjects.length);

    return (
        <div>
            <div className="library-filters reader-tools" role="search">
                <label>
                    <span className="meta">Search </span>
                    <input type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
                </label>
                <label>
                    <span className="meta">Year </span>
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="all">All</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {YEARS[y]}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <span className="meta">Type </span>
                    <select value={kind} onChange={(e) => setKind(e.target.value)}>
                        <option value="all">All</option>
                        {kinds.map((k) => (
                            <option key={k}>{k}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span className="meta">From </span>
                    <select value={by} onChange={(e) => setBy(e.target.value)}>
                        <option value="all">Everyone</option>
                        <option value="Hitesh">Hitesh</option>
                        <option value="Others">Others</option>
                    </select>
                </label>
                <span className="meta" aria-live="polite">
                    {shown.length} of {items.length}
                </span>
            </div>
            {groups.map((g) => (
                <section key={g.y} className="shelf-year" aria-labelledby={`ly${g.y}`}>
                    <h2 id={`ly${g.y}`}>{YEARS[g.y]}</h2>
                    {g.subjects.map(({ s, rows }) => (
                        <div key={s} className="library-subject">
                            <h3>{s}</h3>
                            <ul className="library-rows">
                                {rows.map((i) => {
                                    const external = i.link?.startsWith("http");
                                    const href = i.link ? (external ? i.link : asset(i.link)) : null;
                                    return (
                                        <li key={`${i.title}-${i.link}`}>
                                            <span>
                                                {href ? (
                                                    <a href={href} {...(external ? { rel: "noopener", target: "_blank" } : {})}>
                                                        {i.title}
                                                        {external ? " ↗" : ""}
                                                    </a>
                                                ) : (
                                                    i.title
                                                )}
                                                {i.note && <span className="meta"> — {i.note}</span>}
                                            </span>
                                            <span className="meta">
                                                {i.kind} · {i.by}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </section>
            ))}
            {groups.length === 0 && <p className="meta" style={{ marginTop: "2rem" }}>Nothing matches.</p>}
        </div>
    );
}
