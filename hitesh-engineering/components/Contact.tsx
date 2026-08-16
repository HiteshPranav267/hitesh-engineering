"use client";

import { ArrowUpRight, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import ScrollReveal from "./ScrollReveal";

const links = [
    {
        label: "Email",
        value: "hiteshpranavreddy.d@gmail.com",
        href: "mailto:hiteshpranavreddy.d@gmail.com",
        icon: Mail,
    },
    {
        label: "LinkedIn",
        value: "hitesh-pranav-reddy",
        href: "https://www.linkedin.com/in/hitesh-pranav-reddy-379371264/",
        icon: LinkedinIcon,
    },
    {
        label: "GitHub",
        value: "HiteshPranav267",
        href: "https://github.com/HiteshPranav267",
        icon: GithubIcon,
    },
];

export default function Contact() {
    return (
        <section id="contact" className="py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
                <ScrollReveal className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-px w-8 bg-white/15" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
                            Contact
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-paper leading-[1.1] max-w-2xl mb-5">
                        I&apos;m looking for the next system worth building.
                    </h2>
                    <p className="text-muted text-base md:text-lg max-w-xl leading-relaxed">
                        Open to software, systems, embedded, and AI/ML engineering roles —
                        anywhere software, hardware, and machine learning intersect.
                    </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 border border-white/8 rounded-lg overflow-hidden">
                    {links.map((link, i) => (
                        <ScrollReveal key={link.label} delay={i * 0.05} className="bg-ink-950">
                            <a
                                href={link.href}
                                target={link.label !== "Email" ? "_blank" : undefined}
                                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                                className="group flex flex-col justify-between h-full p-6 hover:bg-ink-900 transition-colors duration-300"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <link.icon className="w-4 h-4 text-faint group-hover:text-accent-400 transition-colors" />
                                    <ArrowUpRight className="w-4 h-4 text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-1">
                                        {link.label}
                                    </p>
                                    <p className="text-paper text-sm truncate">{link.value}</p>
                                </div>
                            </a>
                        </ScrollReveal>
                    ))}

                    <ScrollReveal delay={0.15} className="bg-ink-950">
                        <a
                            href="/hitesh-engineering/Resume_Duggireddy_Hitesh_Pranav_Reddy.pdf"
                            download
                            className="group flex flex-col justify-between h-full p-6 hover:bg-ink-900 transition-colors duration-300"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <Download className="w-4 h-4 text-faint group-hover:text-accent-400 transition-colors" />
                            </div>
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint mb-1">
                                    Resume
                                </p>
                                <p className="text-paper text-sm">Download PDF</p>
                            </div>
                        </a>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
