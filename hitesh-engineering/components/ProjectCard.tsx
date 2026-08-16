"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ScrollReveal from "./ScrollReveal";

const fields: { key: keyof Project; label: string }[] = [
    { key: "problem", label: "Problem" },
    { key: "approach", label: "Approach" },
    { key: "highlight", label: "Engineering detail" },
    { key: "outcome", label: "Outcome" },
];

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <ScrollReveal delay={Math.min(index * 0.06, 0.24)}>
            <article className="border-t border-white/10 py-12 md:py-14">
                <div className="grid md:grid-cols-[minmax(0,280px)_1fr] gap-8 md:gap-14">
                    <div>
                        <span className="font-mono text-xs text-accent-500 block mb-4">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl md:text-[1.7rem] font-semibold text-paper tracking-tight leading-tight mb-3">
                            {project.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed mb-6">{project.tagline}</p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {project.stack.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 text-[11px] rounded-full border border-white/10 text-faint font-mono"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            {project.links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-paper hover:text-accent-400 transition-colors"
                                >
                                    {link.label}
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            ))}
                            <span className="text-faint text-xs font-mono ml-auto md:ml-0">
                                {project.period}
                            </span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                        {fields.map((f) => (
                            <div key={f.key}>
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-2">
                                    {f.label}
                                </p>
                                <p className="text-muted text-sm leading-relaxed">
                                    {(project[f.key] as string) ?? ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </article>
        </ScrollReveal>
    );
}
