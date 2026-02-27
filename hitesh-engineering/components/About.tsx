"use client";

import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const aboutParagraphs = [
    "I am an Electronics and Communication Engineering undergraduate at PES University with a strong interest in VLSI, hardware security, and intelligent systems. I am naturally drawn to understanding how systems work at a fundamental level — from digital logic and architecture to the software that drives modern technology.",
    "I approach engineering with curiosity and discipline, valuing clarity, structure, and practical problem-solving. I enjoy working at the intersection of hardware and software, and I am particularly interested in how machine learning can strengthen security and system reliability.",
    "Beyond academics, I actively contribute to student-led technical initiatives, where I have taken on mentoring, coordination, and operational responsibilities. These experiences have shaped my ability to work in teams, communicate clearly, and handle responsibility under pressure.",
    "I am motivated by continuous learning and by building solutions that are precise, efficient, and thoughtfully engineered.",
];

export default function About() {
    return (
        <section id="about" className="py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    title="About Me"
                    subtitle="Engineer. Builder. Lifelong learner."
                />

                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="space-y-5">
                        {aboutParagraphs.map((para, i) => (
                            <ScrollReveal key={i} delay={i * 0.08}>
                                <p className="text-slate-400 leading-relaxed text-base md:text-lg">
                                    {para}
                                </p>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.15}>
                        <div className="w-full max-w-sm mx-auto aspect-square rounded-2xl bg-gradient-to-br from-electric-500/10 to-violet-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-electric-500/5 to-violet-500/5" />
                            <div className="text-center p-8 relative z-10">
                                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-electric-400 to-violet-400 bg-clip-text text-transparent mb-4">
                                    ECE
                                </div>
                                <div className="text-slate-500 text-sm tracking-wider uppercase">
                                    PES University
                                </div>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {["VLSI", "Security", "ML", "Embedded"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 text-xs rounded-full border border-white/10 text-slate-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}