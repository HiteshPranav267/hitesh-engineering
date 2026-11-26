"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { safeStorage, setStorage, useBrowserValue } from "@/lib/browser";
import { normPath, parseTrail, readTrailRaw, type TrailEntry } from "@/lib/trail";

const NAMES: Record<string, string> = {
    "/": "the room",
    "/list/": "the list view",
    "/projects/": "projects",
    "/notes/": "notes",
    "/library/": "the library",
    "/experience/": "experience",
    "/cv/": "the CV",
    "/contact/": "contact",
    "/rtl-design-docs/": "RTL design docs",
};

const labelFor = (e: TrailEntry) => NAMES[e.path] ?? e.title ?? "the previous page";

/**
 * "← Back to …" the page the visitor came from in this tab. With no earlier page
 * (a direct visit), falls back to `parent`, or shows nothing for top-level pages.
 */
export default function BackLink({ parent }: { parent?: { href: string; label: string } }) {
    const path = normPath(usePathname());
    const trail = parseTrail(useBrowserValue(["storagechange"], readTrailRaw, null));
    const prev = trail.at(-1)?.path === path ? trail.at(-2) : trail.at(-1);
    const target = prev ? { href: prev.path, label: labelFor(prev) } : parent;
    if (!target) return null;
    // Back in the room, re-focus the object the visitor left through.
    const onClick = target.href === "/" ? () => setStorage("session", "room-return", safeStorage("session", "room-from") ?? "") : undefined;
    return (
        <Link className="back-link meta no-print" href={target.href} onClick={onClick}>
            ← Back to {target.label}
        </Link>
    );
}
