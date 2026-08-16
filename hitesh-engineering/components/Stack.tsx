"use client";

import { stack } from "@/data/stack";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

export default function Stack() {
    return (
        <section id="stack" className="py-24 md:py-32 border-b border-white/8">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    index="04"
                    eyebrow="Engineering Stack"
                    title="Organized by what it does, not what it looks like."
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
                    {stack.map((group, i) => (
                        <ScrollReveal key={group.category} delay={Math.min(i * 0.05, 0.2)}>
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-500 mb-4">
                                {group.category}
                            </p>
                            <ul className="space-y-2.5 border-l border-white/10 pl-4">
                                {group.items.map((item) => (
                                    <li key={item} className="text-muted text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
