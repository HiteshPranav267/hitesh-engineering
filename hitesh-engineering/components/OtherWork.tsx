"use client";

import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

export default function OtherWork() {
    const other = projects.filter((p) => !p.featured);

    return (
        <section className="py-24 md:py-32 border-b border-white/8">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    index="05"
                    eyebrow="Explorations"
                    title="Other work."
                    subtitle="Smaller builds — tooling, research, and automation I put together outside the featured projects."
                />

                <div className="grid sm:grid-cols-2 gap-px bg-white/8 border border-white/8 rounded-lg overflow-hidden">
                    {other.map((p, i) => (
                        <ScrollReveal
                            key={p.slug}
                            delay={Math.min(i * 0.05, 0.2)}
                            className={`bg-ink-950 ${i === other.length - 1 && other.length % 2 !== 0 ? "sm:col-span-2" : ""
                                }`}
                        >
                            <a
                                href={p.links[0]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block h-full p-7 hover:bg-ink-900 transition-colors duration-300"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="text-base font-medium text-paper">{p.title}</h3>
                                    <ArrowUpRight className="w-4 h-4 text-faint group-hover:text-accent-400 transition-colors shrink-0 mt-0.5" />
                                </div>
                                <p className="text-muted text-sm leading-relaxed mb-4">
                                    {p.tagline}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {p.stack.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 text-[10px] rounded-full border border-white/10 text-faint font-mono"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </a>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
