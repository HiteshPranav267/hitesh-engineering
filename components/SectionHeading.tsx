"use client";

import ScrollReveal from "./ScrollReveal";

export default function SectionHeading({
    index,
    eyebrow,
    title,
    subtitle,
    align = "left",
}: {
    index?: string;
    eyebrow: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
}) {
    const isCenter = align === "center";

    return (
        <ScrollReveal className={`mb-14 md:mb-20 ${isCenter ? "text-center" : ""}`}>
            <div className={`flex items-center gap-3 mb-5 ${isCenter ? "justify-center" : ""}`}>
                {index && (
                    <span className="font-mono text-[13px] text-accent-500">{index}</span>
                )}
                <span className="h-px w-8 bg-white/15" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
                    {eyebrow}
                </span>
            </div>
            <h2 className="text-3xl md:text-[2.75rem] font-semibold tracking-tight text-paper leading-[1.1]">
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`mt-4 text-muted text-base md:text-lg leading-relaxed ${isCenter ? "max-w-xl mx-auto" : "max-w-xl"
                        }`}
                >
                    {subtitle}
                </p>
            )}
        </ScrollReveal>
    );
}
