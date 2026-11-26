import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import FoundIt from "@/components/eggs/FoundIt";

// Linked only from the DevTools console and a comment in the README.
export const metadata: Metadata = { title: "You found it", robots: { index: false, follow: false } };

export default function FoundItPage() {
    return (
        <main id="main" className="page">
            <BackLink parent={{ href: "/", label: "the room" }} />
            <FoundIt />
        </main>
    );
}
