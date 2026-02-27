"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";

export default function Projects() {
    const featuredProjects = projects.filter((p: Project) => p.featured);

    return (
        <section id="projects" className="py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    title="Projects"
                    subtitle="A selection of work I'm proud of."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project: Project, i: number) => (
                        <ScrollReveal key={project.slug} delay={i * 0.1}>
                            <ProjectCard project={project} />
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={0.2} className="flex justify-center mt-12">
                    <Link href="/projects">
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:border-electric-500/50 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
                        >
                            View All Projects
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </motion.span>
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}