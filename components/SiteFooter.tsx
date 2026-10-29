"use client";

import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/content";

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
        </footer>
    );
}
