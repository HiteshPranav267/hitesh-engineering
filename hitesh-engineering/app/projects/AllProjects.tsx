"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AllProjects() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <ScrollReveal className="mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/"
                                className="text-slate-500 hover:text-electric-400 transition-colors text-sm"
                            >
                                ← Home
                            </Link>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-electric-400 to-violet-400 bg-clip-text text-transparent">
                                All Projects
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Everything I&apos;ve built — from research prototypes to hackathon projects.
                        </p>
                    </ScrollReveal>

                    {/* Projects Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project: Project, i: number) => (
                            <ScrollReveal key={project.slug} delay={i * 0.08}>
                                <ProjectCard project={project} />
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Back to home */}
                    <ScrollReveal delay={0.2} className="flex justify-center mt-16">
                        <Link href="/">
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:border-electric-500/50 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
                            >
                                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Back to Home
                            </motion.span>
                        </Link>
                    </ScrollReveal>
                </div>
            </main>
            <Footer />
        </>
    );
}
