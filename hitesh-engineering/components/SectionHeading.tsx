"use client";

import ScrollReveal from "./ScrollReveal";

export default function SectionHeading({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <ScrollReveal className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-electric-400 to-violet-400 bg-clip-text text-transparent">
                    {title}
                </span>
            </h2>
            {subtitle && (
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
            )}
        </ScrollReveal>
    );
}