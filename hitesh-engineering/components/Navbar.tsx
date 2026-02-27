"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navItems = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Resume", href: "#resume" },
    { name: "Notes", href: "/notes" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setMobileOpen(false);
        if (!href.startsWith("#")) return;
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? "bg-navy-900/80 backdrop-blur-xl border-b border-white/5"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-xl font-bold bg-gradient-to-r from-electric-400 to-violet-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                    >
                        HPR
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) =>
                            item.href.startsWith("#") ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item.href)}
                                    className="text-slate-300 hover:text-white transition-colors text-sm tracking-wide"
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-slate-300 hover:text-white transition-colors text-sm tracking-wide"
                                >
                                    {item.name}
                                </Link>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-slate-300 block"
                        />
                        <motion.span
                            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-6 h-0.5 bg-slate-300 block"
                        />
                        <motion.span
                            animate={
                                mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                            }
                            className="w-6 h-0.5 bg-slate-300 block"
                        />
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-navy-900/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {navItems.map((item, i) =>
                                item.href.startsWith("#") ? (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        onClick={() => handleNavClick(item.href)}
                                        className="text-2xl text-slate-200 hover:text-white text-left"
                                    >
                                        {item.name}
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="text-2xl text-slate-200 hover:text-white"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}