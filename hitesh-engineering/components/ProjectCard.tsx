"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
        >
            <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative h-full bg-navy-800/50 border border-white/5 rounded-xl p-6 transition-all duration-300 hover:border-electric-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] cursor-pointer"
            >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-500/0 to-violet-500/0 group-hover:from-electric-500/5 group-hover:to-violet-500/5 transition-all duration-500" />

                <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-electric-400 transition-colors">
                        {project.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-slate-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </a>
    );
}