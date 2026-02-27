"use client";

import { motion } from "framer-motion";
import GradientBlob from "./GradientBlob";

export default function Hero() {
    const handleScrollToProjects = () => {
        const el = document.querySelector("#projects");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <GradientBlob />

            <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-electric-400 text-sm md:text-base tracking-widest uppercase mb-6 font-mono"
                >
                    Welcome
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.28 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                >
                    <span className="bg-gradient-to-r from-white via-electric-400 to-violet-400 bg-clip-text text-transparent">
                        Hitesh Pranav Reddy
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.42 }}
                    className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
                >
                    ECE | VLSI &amp; Hardware Security
                    | ML &amp; Cyber Security
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.56 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={handleScrollToProjects}
                        className="px-8 py-3.5 bg-gradient-to-r from-electric-500 to-violet-500 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95"
                    >
                        View Projects
                    </button>

                    <a
                        href="/resume.pdf"
                        download
                        className="px-8 py-3.5 border border-slate-600 rounded-lg text-slate-300 font-medium hover:border-electric-500/50 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        Download Resume
                    </a>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-900 to-transparent" />
        </section>
    );
}