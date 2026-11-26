"use client";

import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/content";

// "You are cool for opening my website", 8-bit ASCII.
const BINARY = "01011001 01101111 01110101 00100000 01100001 01110010 01100101 00100000 01100011 01101111 01101111 01101100 00100000 01100110 01101111 01110010 00100000 01101111 01110000 01100101 01101110 01101001 01101110 01100111 00100000 01101101 01111001 00100000 01110111 01100101 01100010 01110011 01101001 01110100 01100101";

export default function SiteFooter({ profile }: { profile: Profile }) {
    const path = usePathname() || "/";
    if (path === "/" || path.startsWith("/room")) return null;
    return (
        <footer className="site-footer">
            <div className="inner meta">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <a href={profile.links.github}>GitHub</a>
                <a href={profile.links.linkedin}>LinkedIn</a>
            </div>
            <p className="inner binary" aria-hidden="true" title="8-bit ASCII. Decode it.">
                {BINARY}
            </p>
        </footer>
    );
}
