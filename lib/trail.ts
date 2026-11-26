"use client";

import { safeStorage, setStorage } from "./browser";

/** Pages visited in this tab, oldest first, so a page can link back to wherever the visitor came from. */
export interface TrailEntry {
    path: string;
    title?: string;
}

const KEY = "trail";

export const normPath = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function parseTrail(raw: string | null): TrailEntry[] {
    try {
        const t = JSON.parse(raw ?? "[]");
        return Array.isArray(t) ? t : [];
    } catch {
        return [];
    }
}

export const readTrail = () => parseTrail(safeStorage("session", KEY));
export const readTrailRaw = () => safeStorage("session", KEY);
export const writeTrail = (t: TrailEntry[]) => setStorage("session", KEY, JSON.stringify(t.slice(-20)));
