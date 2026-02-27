"use client";

import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";

export default function Projects() {
    return (
        <section id="projects" className="py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
                <SectionHeading
                    title="Projects"
                    subtitle="A selection of work I'm proud of."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: Project, i: number) => (
                        <ScrollReveal key={project.slug} delay={i * 0.1}>
                            <ProjectCard project={project} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}