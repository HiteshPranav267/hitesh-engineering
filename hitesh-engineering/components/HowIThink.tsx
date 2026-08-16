"use client";

import ScrollReveal from "./ScrollReveal";

const layers = ["Sensor", "Firmware", "Backend", "Model", "Interface"];

export default function HowIThink() {
    return (
        <section className="py-24 md:py-32 border-b border-white/8 bg-ink-900/40">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <ScrollReveal>
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint mb-5">
                            How I Think
                        </p>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-paper leading-[1.15] mb-6">
                            I like the whole system.
                        </h2>
                        <div className="space-y-4 text-muted text-base md:text-lg leading-relaxed">
                            <p>
                                Most problems don&apos;t live inside one discipline. A product
                                might start at a sensor, move through firmware, get processed
                                by a backend, pass through a model, and end up as something a
                                person actually interacts with.
                            </p>
                            <p>
                                Understanding one of those pieces is useful. Understanding how
                                they hold together — where the constraints of one layer show up
                                as bugs two layers away — is the part I actually enjoy.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.15}>
                        <div className="flex flex-col gap-3">
                            {layers.map((layer, i) => (
                                <div key={layer} className="flex items-center gap-4 group">
                                    <span className="font-mono text-xs text-faint w-6 shrink-0">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="flex-1 flex items-center justify-between border border-white/10 rounded-md px-5 py-4 transition-colors duration-300 group-hover:border-accent-500/40">
                                        <span className="text-paper text-sm md:text-base font-medium">
                                            {layer}
                                        </span>
                                        {i < layers.length - 1 && (
                                            <span className="text-faint text-xs font-mono">↓</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
