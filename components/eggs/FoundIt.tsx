"use client";

import { useEffect } from "react";
import { safeStorage, setStorage, useBrowserValue } from "@/lib/browser";
import { EGGS, findEgg, foundEggs } from "@/lib/eggs";

function Badge() {
    return (
        <svg viewBox="0 0 220 250" className="found-badge" role="img" aria-label="A badge that says: you found it">
            {/* ribbon */}
            <polygon points="70,150 50,240 80,222 98,246 110,160" fill="var(--brick)" />
            <polygon points="150,150 170,240 140,222 122,246 110,160" fill="var(--teal)" />
            {/* scalloped medal */}
            {Array.from({ length: 16 }, (_, i) => {
                const a = (i / 16) * Math.PI * 2;
                return <circle key={i} cx={110 + Math.cos(a) * 78} cy={100 + Math.sin(a) * 78} r="16" fill="var(--amber)" />;
            })}
            <circle cx="110" cy="100" r="80" fill="var(--amber)" />
            <circle cx="110" cy="100" r="66" fill="var(--cream)" stroke="var(--black)" strokeOpacity="0.15" strokeWidth="3" />
            <text x="110" y="88" textAnchor="middle" className="found-badge-small">
                YOU
            </text>
            <text x="110" y="118" textAnchor="middle" className="found-badge-big">
                found it
            </text>
            <path d="M84 132 h52" stroke="var(--brick)" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

export default function FoundIt() {
    useEffect(() => {
        findEgg("found-it");
        if (!safeStorage("local", "found-it-on")) setStorage("local", "found-it-on", new Date().toISOString().slice(0, 10));
    }, []);
    const have = useBrowserValue(["eggfound", "storagechange"], () => foundEggs().join(), "").split(",").filter(Boolean);
    const on = useBrowserValue(["storagechange"], () => safeStorage("local", "found-it-on") ?? "", "");

    return (
        <div className="found-it">
            <Badge />
            <h1>You found it.</h1>
            <p>
                This page isn&apos;t linked from anywhere on the site. You either read the console, read the README, or guessed the URL. Any of those is the
                right instinct for someone poking at hardware.
            </p>
            {on && <p className="meta">Badge earned {on}. It lives in this browser only.</p>}
            <h2>
                Easter eggs: {have.length} / {EGGS.length}
            </h2>
            <ul className="egg-list">
                {EGGS.map((e) => {
                    const got = have.includes(e.id);
                    return (
                        <li key={e.id} className={got ? "got" : undefined}>
                            <span aria-hidden="true">{got ? "●" : "○"}</span> {got ? e.name : <span className="meta">??? — {e.hint}</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
