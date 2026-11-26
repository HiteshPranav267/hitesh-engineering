"use client";

import { useEffect } from "react";
import { useBrowserValue } from "@/lib/browser";

/** Wall-clock time in Bengaluru, whatever the visitor's timezone. */
export function istParts(d = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" }).formatToParts(d);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    const h = Number(get("hour"));
    const m = Number(get("minute"));
    const weekday = get("weekday");
    return { h, m, weekday, hhmm: `${get("hour")}:${get("minute")}`, weekend: weekday === "Sat" || weekday === "Sun" };
}

/** IST date as YYYY-MM-DD (for "today" counters). */
export const istDate = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** Re-renders every ~15 s with the current IST minute. `null` while prerendering. */
export function useIst() {
    useEffect(() => {
        const id = setInterval(() => window.dispatchEvent(new Event("clocktick")), 15_000);
        return () => clearInterval(id);
    }, []);
    // A string snapshot keeps useSyncExternalStore stable between ticks.
    const key = useBrowserValue(["clocktick", "focus", "visibilitychange"], () => {
        const p = istParts();
        return `${p.hhmm}|${p.weekday}`;
    }, "");
    if (!key) return null;
    const [hhmm, weekday] = key.split("|");
    const h = Number(hhmm.slice(0, 2));
    return { hhmm, h, weekday, weekend: weekday === "Sat" || weekday === "Sun", late: h >= 1 && h < 4, dark: h < 6 || h >= 18 };
}
