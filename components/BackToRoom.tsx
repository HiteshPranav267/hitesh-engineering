"use client";

import Link from "next/link";
import { safeStorage, useBrowserValue } from "@/lib/browser";

/** Shown only when the visitor arrived by clicking an object in the room. */
export default function BackToRoom() {
    const from = useBrowserValue(["storagechange"], () => safeStorage("session", "room-from"), null);
    if (!from) return null;
    return (
        <Link className="back-to-room meta no-print" href={`/room/?from=${encodeURIComponent(from)}`}>
            ← Back to the room
        </Link>
    );
}
