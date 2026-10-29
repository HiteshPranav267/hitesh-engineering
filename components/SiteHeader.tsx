"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV = [
    { href: "/projects/", label: "Projects" },
    { href: "/notes/", label: "Notes" },
    { href: "/experience/", label: "Experience" },
    { href: "/cv/", label: "CV" },
    { href: "/about/", label: "About" },
    { href: "/contact/", label: "Contact" },
    { href: "/", label: "Room" },
];

export default function SiteHeader({ name }: { name: string }) {
    const path = usePathname() || "/";
    if (path === "/" || path.startsWith("/room")) return null;
    return (
        <header className="site-header">
            <div className="inner">
                <Link href="/list/" className="site-name">
                    {name}
                </Link>
                <nav className="site-nav" aria-label="Main">
                    {NAV.map((n) => (
                        <Link key={n.href} href={n.href} aria-current={n.href !== "/" && path.startsWith(n.href.slice(0, -1)) ? "page" : undefined}>
                            {n.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
