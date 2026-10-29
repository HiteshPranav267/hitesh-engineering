"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const navItems = [
    { name: "Work", href: "/#work" },
    { name: "About", href: "/#about" },
    { name: "Experience", href: "/#experience" },
    { name: "Stack", href: "/#stack" },
    { name: "Notes", href: "/notes" },
    { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setMobileOpen(false);

        if (href.startsWith("/#") && pathname === "/") {
            const id = href.substring(1);
            const el = document.querySelector(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }

        router.push(href);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-ink-950/85 backdrop-blur-xl border-b border-white/8"
                    : "border-b border-transparent"
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        onClick={(e) => {
                            if (pathname === "/") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        className="font-mono text-sm tracking-tight text-paper hover:text-accent-400 transition-colors"
                    >
                        HP<span className="text-accent-500">/</span>eng
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className="text-muted hover:text-paper transition-colors text-sm bg-transparent border-none cursor-pointer"
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="https://github.com/HiteshPranav267"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-faint hover:text-paper transition-colors"
                        >
                            <GithubIcon className="w-[18px] h-[18px]" />
                        </a>
                        <a
                            href="https://linkedin.com/in/hitesh-pranav-reddy-379371264"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-faint hover:text-paper transition-colors"
                        >
                            <LinkedinIcon className="w-[18px] h-[18px]" />
                        </a>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-paper"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-ink-950/98 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {navItems.map((item, i) => (
                                <motion.button
                                    key={item.name}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => handleNavClick(item.href)}
                                    className="text-2xl text-paper text-left bg-transparent border-none cursor-pointer"
                                >
                                    {item.name}
                                </motion.button>
                            ))}
                            <div className="flex items-center gap-6 pt-4 border-t border-white/10 mt-2">
                                <a
                                    href="https://github.com/HiteshPranav267"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="text-muted hover:text-paper transition-colors"
                                >
                                    <GithubIcon className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://linkedin.com/in/hitesh-pranav-reddy-379371264"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="text-muted hover:text-paper transition-colors"
                                >
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
