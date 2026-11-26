"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { normPath, readTrail, writeTrail } from "@/lib/trail";

/** Records each page visit; returning to the page before the current one counts as going back. */
export default function NavTrail() {
    const path = normPath(usePathname());
    useEffect(() => {
        const trail = readTrail();
        if (trail.at(-2)?.path === path) trail.pop();
        else if (trail.at(-1)?.path !== path) trail.push({ path });
        writeTrail(trail);
        // Next sets the page title just after the route renders.
        const t = setTimeout(() => {
            trail[trail.length - 1].title = document.title.split(" — ")[0];
            writeTrail(trail);
        }, 300);
        return () => clearTimeout(t);
    }, [path]);
    return null;
}
