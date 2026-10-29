"use client";

import Link from "next/link";
import { safeStorage, setStorage, useBrowserValue } from "@/lib/browser";

/** Shown only when the visitor arrived by clicking an object in the room. */
export default function BackToRoom() {
    const from = useBrowserValue(["storagechange"], () => safeStorage("session", "room-from"), null);
    if (!from) return null;
    return (
        <Link className="back-to-room meta no-print" href="/room/" onClick={() => setStorage("session", "room-return", from)}>
            ← Back to the room
        </Link>
    );
}
