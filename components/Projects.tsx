"use client";

import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";

export default function Projects() {
    const featured = projects.filter((p) => p.featured);

    return (
        <section id="work" className="py-24 md:py-32 border-b border-white/8">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    index="02"
                    eyebrow="Selected Work"
                    title="Systems worth explaining."
                    subtitle="Each one is a case study, not a portfolio card — the problem, the approach, and what made it worth building."
                />

                <div>
                    {featured.map((project, i) => (
                        <ProjectCard key={project.slug} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
