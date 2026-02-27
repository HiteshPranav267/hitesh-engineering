"use client";

import { useEffect } from "react";
import { resumeData } from "@/data/resume";

export default function ResumePDF() {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.location.search.includes("print=true")) {
                window.print();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="resume-container bg-white min-h-screen text-black font-sans leading-tight max-w-[8.5in] mx-auto shadow-xl print:shadow-none">
            <div className="p-10 md:p-12 print:p-8">
                {/* Header */}
                <header className="text-center mb-4">
                    <h1 className="text-3xl font-bold mb-1">
                        <a href="https://hitesh-pranav.vercel.app/" className="hover:text-blue-600 transition-colors">
                            {resumeData.name}
                        </a>
                    </h1>
                    <div className="flex justify-center flex-wrap gap-x-2 text-[10pt] text-slate-800 font-medium">
                        <a href={`https://${resumeData.contact.linkedin}`} className="hover:underline">{resumeData.contact.linkedin}</a>
                        <span>|</span>
                        <span>{resumeData.contact.phone}</span>
                        <span>|</span>
                        <a href={`mailto:${resumeData.contact.email}`} className="hover:underline">{resumeData.contact.email}</a>
                        <span>|</span>
                        <a href={`https://${resumeData.contact.github}`} className="hover:underline text-blue-600 font-semibold">{resumeData.contact.github}</a>
                    </div>
                </header>

                {/* Content */}
                <div className="space-y-4">

                    {/* Education */}
                    <section>
                        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 tracking-tight">Education</h2>
                        <div className="space-y-2">
                            {resumeData.education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline font-bold text-[10pt]">
                                        <span>{edu.institution}</span>
                                        <span>{resumeData.contact.location}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline text-[10pt]">
                                        <span className="italic">{edu.degree}</span>
                                        <span>{edu.period}</span>
                                    </div>
                                    <div className="text-[9pt] mt-0.5">
                                        <span className="italic font-medium">GPA: {edu.details.replace("CGPA: ", "")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 tracking-tight">Experience</h2>
                        <div className="space-y-3">
                            {resumeData.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline font-bold text-[10pt]">
                                        <span>{exp.company}</span>
                                        <span>{resumeData.contact.location}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline text-[10pt] mb-1">
                                        <span className="italic">{exp.role}</span>
                                        <span>{exp.period}</span>
                                    </div>
                                    <ul className="list-disc ml-5 text-[9pt] space-y-0.5">
                                        {exp.bullets.map((bullet, j) => (
                                            <li key={j}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    <section>
                        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 tracking-tight">Research & Projects</h2>
                        <div className="space-y-3">
                            {resumeData.projects.map((project, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline font-bold text-[10pt]">
                                        <span>{project.title}</span>
                                        <span>{project.period}</span>
                                    </div>
                                    <div className="text-[10pt] italic font-medium">
                                        {project.tech}
                                    </div>
                                    <ul className="list-disc ml-5 text-[9pt] space-y-0.5 mt-1">
                                        {project.bullets.map((bullet, j) => (
                                            <li key={j}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 tracking-tight">Skills</h2>
                        <div className="space-y-1">
                            {resumeData.skills.map((skill, i) => (
                                <div key={i} className="text-[10pt]">
                                    <span className="font-bold">{skill.category}: </span>
                                    <span>{skill.items.join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Floating FAB - Hidden on print */}
            <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
                <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M12 3v9m0 0l-3-3m3 3l3-3" />
                    </svg>
                    Download PDF
                </button>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                @media print {
                    @page {
                        margin: 0;
                        size: A4;
                    }
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        font-family: 'Inter', sans-serif !important;
                    }
                    .resume-container {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        width: 100% !important;
                        max-width: none !important;
                    }
                }
                body {
                    background-color: #f1f5f9;
                    font-family: 'Inter', sans-serif;
                }
                .resume-container {
                    line-height: 1.25;
                }
            `}</style>
        </div>
    );
}

