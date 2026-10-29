import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Room" };

export default function RoomPage() {
    return (
        <main id="main" className="page">
            <p>
                The room is being built. <Link href="/">View as list</Link>
            </p>
        </main>
    );
}
