"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";

const education = [
    {
        degree: "B.Tech — Electronics & Communication Engineering",
        institution: "PES University, Bengaluru",
        period: "2023 – 2027",
        details: "CGPA: 8.49",
    },
    {
        degree: "High School Secondary Education",
        institution: "Sri Chaitanya College of Education",
        period: "2011 – 2023",
        details: "Completed my schooling with 83.2% in Class 10 and 91.4% in Class 12 (Science), where I discovered my passion for electronics, problem-solving, and technology through academics and extracurricular involvement.Percentage: 95%",
    },
];

const experience = [
    {
        role: "Student Head",
        company: "Joy of Engineering Lab (JoEL), PES University",
        period: "August2024 – Present",
        bullets: [
            "Contributed to the backend planning and technical coordination of HackeZee 2025, JoEL's flagship hardware hackathon.",
            "Assisted in event logistics, participant support, and mentoring, ensuring a smooth experience for all attendees for multiple events",
            "Mentored 6+ teams on IoT based projects, guiding them through design, implementation, and debugging processes.",
        ],
    },
    {
        role: "Technical Lead",
        company: "Center for Information Security, Forensics and Cyber Resilience (C-ISFCR)",
        period: "June 2025 – July 2025",
        bullets: [
            "Collaborated with a team to develop a modular cybersecurity framework for automotive networks.",
            "Designed and implemented a full-stack intrusion detection system (IDS) using machine learning models.",
            "Integrated a real-time Python-based firewall with an ensemble of models to enhance vehicular safety.",
            "Created a Tkinter-based GUI for controlled CAN message injection and post-attack analytics visualization.",
        ],
    },
];

const skills: { category: string; items: string[] }[] = [
    { category: "Languages", items: ["Python", "C / C++", "TypeScript", "Verilog / VHDL"] },
    { category: "Hardware", items: ["FPGA", "ARM Cortex-M", "PCB Design", "JTAG / SWD"] },
    { category: "ML & Security", items: ["Scikit-learn", "PyTorch", "IDS / Anomaly Detection", "CAN Bus Security"] },
    { category: "Tools", items: ["Git", "Vivado", "KiCad", "Linux", "Docker"] },
];

export default function Resume() {
    return (
        <section id="resume" className="py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                <SectionHeading
                    title="Resume"
                    subtitle="Education, experience, and the skills I bring to the table."
                />

                {/* Download button */}
                <ScrollReveal className="flex justify-center mb-16">
                    <motion.a
                        href="/resume.pdf"
                        download
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-electric-500 to-violet-500 text-white font-medium shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9" />
                        </svg>
                        Download Full CV
                    </motion.a>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left column — Education & Experience */}
                    <div className="space-y-10">
                        {/* Education */}
                        <ScrollReveal>
                            <h3 className="text-xs font-semibold tracking-widest uppercase text-electric-400 mb-6">
                                Education
                            </h3>
                            <div className="space-y-6">
                                {education.map((edu, i) => (
                                    <div
                                        key={i}
                                        className="relative pl-5 border-l border-white/10"
                                    >
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-electric-400" />
                                        <p className="text-white font-semibold text-sm mb-0.5">{edu.degree}</p>
                                        <p className="text-slate-400 text-sm">{edu.institution}</p>
                                        <p className="text-slate-600 text-xs mt-1 mb-2">{edu.period}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{edu.details}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>

                        {/* Experience */}
                        <ScrollReveal delay={0.1}>
                            <h3 className="text-xs font-semibold tracking-widest uppercase text-electric-400 mb-6">
                                Experience
                            </h3>
                            <div className="space-y-8">
                                {experience.map((exp, i) => (
                                    <div
                                        key={i}
                                        className="relative pl-5 border-l border-white/10"
                                    >
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-400" />
                                        <p className="text-white font-semibold text-sm mb-0.5">{exp.role}</p>
                                        <p className="text-slate-400 text-sm">{exp.company}</p>
                                        <p className="text-slate-600 text-xs mt-1 mb-3">{exp.period}</p>
                                        <ul className="space-y-1.5">
                                            {exp.bullets.map((b, j) => (
                                                <li key={j} className="flex items-start gap-2 text-slate-500 text-sm leading-relaxed">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right column — Skills */}
                    <ScrollReveal delay={0.15}>
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-electric-400 mb-6">
                            Skills
                        </h3>
                        <div className="space-y-7">
                            {skills.map((group) => (
                                <div key={group.category}>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">
                                        {group.category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((item) => (
                                            <span
                                                key={item}
                                                className="px-3 py-1.5 text-xs rounded-full bg-navy-800/50 border border-white/10 text-slate-300 hover:border-electric-500/40 hover:text-white transition-colors duration-200"
                                            >
                                                {item}
                                            </span>
                                        ))}
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
