"use client";

import ScrollReveal from "./ScrollReveal";

const specs = [
    { label: "Institution", value: "PES University" },
    { label: "Program", value: "B.Tech, ECE" },
    { label: "Graduating", value: "2027" },
    { label: "Based in", value: "Bengaluru, India" },
];

export default function Currently() {
    return (
        <section className="py-20 md:py-24 border-b border-white/8">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-start">
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
                                Currently
                            </span>
                        </div>
                        <p className="text-2xl md:text-3xl text-paper font-medium leading-snug max-w-2xl">
                            Building software and intelligent systems. Exploring systems
                            engineering, AI/ML, and hardware-software integration.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.1}>
                        <dl className="grid grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-4 md:min-w-[220px] md:border-l md:border-white/10 md:pl-8">
                            {specs.map((s) => (
                                <div key={s.label}>
                                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-1">
                                        {s.label}
                                    </dt>
                                    <dd className="text-sm text-muted">{s.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
