"use client";

import { experience } from "@/data/experience";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

export default function Experience() {
    return (
        <section id="experience" className="py-24 md:py-32 border-b border-white/8">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    index="03"
                    eyebrow="Experience"
                    title="Leadership and research."
                />

                <div className="space-y-14">
                    {experience.map((exp, i) => (
                        <ScrollReveal key={exp.role} delay={i * 0.08}>
                            <div className="grid md:grid-cols-[minmax(0,280px)_1fr] gap-6 md:gap-14 border-t border-white/10 pt-10">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-3">
                                        {exp.period}
                                    </p>
                                    <h3 className="text-xl font-semibold text-paper mb-1">{exp.role}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{exp.org}</p>
                                </div>

                                <div>
                                    <p className="text-paper text-base md:text-lg leading-relaxed mb-5">
                                        {exp.summary}
                                    </p>
                                    <ul className="space-y-3">
                                        {exp.points.map((point, j) => (
                                            <li key={j} className="flex items-start gap-3 text-muted text-sm leading-relaxed">
                                                <span className="mt-2 w-1 h-1 rounded-full bg-accent-500 shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
