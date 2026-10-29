"use client";

import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const aboutParagraphs = [
    "I started in electronics because I wanted to understand technology from the ground up — not just use it, but know what's happening underneath.",
    "That led me toward the software and systems built on top of hardware. Since then I've worked across full-stack development, embedded systems, machine learning, and cybersecurity — not by accident, but because I keep finding the interesting problems at the boundary between disciplines.",
    "I like understanding how a system works underneath the abstraction, then actually building it. A CAN bus intrusion detector isn't just a classifier — it's sensors, a protocol, an attack model, and a response system that has to work in real time. That's the kind of problem I go looking for.",
    "I'm now looking for engineering roles where I can keep working on systems like that, and grow into an engineer who can take a problem from architecture through implementation — not just one layer of it.",
];

const focus = ["Software", "Embedded Systems", "Machine Learning", "Hardware"];

export default function About() {
    return (
        <section id="about" className="py-24 md:py-32 border-b border-white/8">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    index="01"
                    eyebrow="About"
                    title="Ground up, then across."
                />

                <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16">
                    <div className="space-y-6">
                        {aboutParagraphs.map((para, i) => (
                            <ScrollReveal key={i} delay={i * 0.06}>
                                <p className="text-muted leading-relaxed text-base md:text-lg">
                                    {para}
                                </p>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.15}>
                        <div className="border border-white/10 rounded-lg p-7 md:sticky md:top-28">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-5">
                                Background
                            </p>
                            <p className="text-paper text-lg font-medium mb-1">
                                Electronics &amp; Communication Engineering
                            </p>
                            <p className="text-muted text-sm mb-6">
                                PES University, Bengaluru — Class of 2027
                            </p>

                            <div className="h-px bg-white/10 mb-6" />

                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-4">
                                Where it shows up
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {focus.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-muted"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
