"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

export default function Hero() {
    const handleScrollToWork = () => {
        const el = document.querySelector("#work");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden border-b border-white/8">
            <div className="absolute inset-0 bg-grid" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" />

            <div className="max-w-6xl mx-auto px-6 w-full relative z-10 pt-28 pb-20">
                <motion.p
                    {...fade(0.05)}
                    className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-accent-500 mb-6"
                >
                    Systems Engineer
                </motion.p>

                <motion.h1
                    {...fade(0.15)}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[1.02] text-paper mb-8"
                >
                    Hitesh Pranav
                </motion.h1>

                <motion.div {...fade(0.25)} className="mb-10">
                    <p className="text-xl md:text-3xl text-muted font-medium leading-snug max-w-2xl">
                        Building across{" "}
                        <span className="text-paper">software</span>
                        <span className="text-faint mx-1">×</span>
                        <span className="text-paper">hardware</span>
                        <span className="text-faint mx-1">×</span>
                        <span className="text-paper">AI</span>.
                    </p>
                </motion.div>

                <motion.p
                    {...fade(0.35)}
                    className="text-muted text-base md:text-lg max-w-xl leading-relaxed mb-12"
                >
                    I study ECE, but apparently decided one field wasn&apos;t enough.
                </motion.p>

                <motion.div
                    {...fade(0.45)}
                    className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-14 font-mono text-sm text-faint"
                >
                    <span>ECE @ PES University</span>
                    <span className="hidden sm:inline text-white/15">/</span>
                    <span>Bengaluru</span>
                    <span className="hidden sm:inline text-white/15">/</span>
                    <span>2027</span>
                </motion.div>

                <motion.div
                    {...fade(0.55)}
                    className="flex flex-wrap items-center gap-4"
                >
                    <button
                        onClick={handleScrollToWork}
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-paper text-ink-950 rounded-md text-sm font-medium transition-all duration-300 hover:bg-accent-400"
                    >
                        Explore My Work
                        <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    </button>

                    <a
                        href="https://github.com/HiteshPranav267"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="inline-flex items-center gap-2 px-5 py-3 border border-white/12 rounded-md text-sm text-muted font-medium hover:text-paper hover:border-white/25 transition-colors duration-300"
                    >
                        <GithubIcon className="w-4 h-4" />
                        GitHub
                    </a>

                    <a
                        href="https://linkedin.com/in/hitesh-pranav-reddy-379371264"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="inline-flex items-center gap-2 px-5 py-3 border border-white/12 rounded-md text-sm text-muted font-medium hover:text-paper hover:border-white/25 transition-colors duration-300"
                    >
                        <LinkedinIcon className="w-4 h-4" />
                        LinkedIn
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
