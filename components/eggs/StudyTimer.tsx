"use client";

/* Notes pages: how long you've been on the site today, with the odd nudge. */

import { useEffect, useState } from "react";
import { readSiteTime } from "@/components/eggs/SiteEggs";
import { safeStorage, setStorage, useBrowserValue } from "@/lib/browser";
import { findEgg } from "@/lib/eggs";
import { istParts } from "@/lib/ist";

const NUDGES: [number, string][] = [
    [15, "15 minutes in. Drink some water, the notes will wait."],
    [30, "Half an hour already. Is there an ISA tomorrow?"],
    [60, "An hour of notes. Respect. Maybe stand up for a second?"],
    [90, "90 minutes. That's a whole lab session. Snack break?"],
    [120, "You've been on this site for 2 hours, grinding for exams?"],
    [180, "3 hours. At this point I should start charging tuition."],
    [240, "4 hours. Even the plane on the shelf took a break. Go stretch."],
    [360, "6 hours?! Whatever this exam is, you've got it. Go sleep."],
];

function fmt(sec: number) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

export default function StudyTimer() {
    const sec = useBrowserValue(["sitetime"], readSiteTime, 0);
    const dismissed = useBrowserValue(["storagechange"], () => safeStorage("session", "nudge-seen") ?? "", "");
    const [late, setLate] = useState<string | null>(null);

    useEffect(() => {
        const check = () => {
            const p = istParts();
            setLate(p.h >= 1 && p.h < 4 ? p.hhmm : null);
        };
        const id = setInterval(check, 30_000);
        const first = setTimeout(check, 0);
        return () => {
            clearInterval(id);
            clearTimeout(first);
        };
    }, []);

    const min = sec / 60;
    const grinding = min >= 120;
    useEffect(() => {
        if (grinding) findEgg("grind");
    }, [grinding]);
    const nudge = [...NUDGES].reverse().find(([t]) => min >= t);
    const key = late ? `late-${late.slice(0, 2)}` : nudge ? String(nudge[0]) : "";
    const text = late ? `It's ${late} AM. The exam is still at 9. Sleep counts as revision too.` : nudge?.[1];
    const show = text && key !== dismissed;

    return (
        <div className="study-timer" aria-live="polite">
            {show && (
                <p className="study-bubble">
                    {text}
                    <button type="button" aria-label="Dismiss" onClick={() => setStorage("session", "nudge-seen", key)}>
                        ×
                    </button>
                </p>
            )}
            {sec >= 60 && (
                <span className="study-chip" title="Time on this site today">
                    ⏱ {fmt(sec)} on the site today
                </span>
            )}
        </div>
    );
}
