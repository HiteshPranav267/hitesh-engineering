"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";

interface Hit {
    url: string;
    title: string;
    excerpt: string;
}

type Pagefind = {
    search: (q: string) => Promise<{ results: { data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }> }[] }>;
};

/** Pagefind search over subject and topic names. The index is built after `next build`. */
export default function NotesSearch() {
    const pf = useRef<Pagefind | null>(null);
    const [q, setQ] = useState("");
    const [hits, setHits] = useState<Hit[]>([]);
    const [state, setState] = useState<"idle" | "missing">("idle");

    useEffect(() => {
        if (!q.trim()) {
            setHits([]);
            return;
        }
        let stale = false;
        (async () => {
            try {
                if (!pf.current) {
                    const url = asset("pagefind/pagefind.js");
                    pf.current = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)) as Pagefind;
                }
                const res = await pf.current.search(q);
                const data = await Promise.all(res.results.slice(0, 8).map((r) => r.data()));
                if (!stale) setHits(data.map((d) => ({ url: d.url, title: d.meta.title ?? d.url, excerpt: d.excerpt })));
            } catch {
                if (!stale) setState("missing");
            }
        })();
        return () => {
            stale = true;
        };
    }, [q]);

    return (
        <div className="search" role="search">
            <label className="meta" htmlFor="notes-q">
                Search subjects and topics
            </label>
            <input id="notes-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            {state === "missing" && <p className="meta">Search is available on the built site.</p>}
            {hits.length > 0 && (
                <ol>
                    {hits.map((h) => (
                        <li key={h.url}>
                            <a href={h.url}>{h.title.replace(/ — .*$/, "")}</a>
                            <br />
                            <span className="meta" dangerouslySetInnerHTML={{ __html: h.excerpt }} />
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
