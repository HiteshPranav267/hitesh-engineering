import type { Metadata } from "next";
import BackToRoom from "@/components/BackToRoom";
import ProjectEntry, { ArchiveLine } from "@/components/ProjectEntry";
import { projectsByGroup } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>Projects</h1>
            <section className="section" aria-labelledby="h-rtl">
                <h2 id="h-rtl">RTL design &amp; verification</h2>
                <ul className="entries">
                    {projectsByGroup("rtl").map((p) => (
                        <ProjectEntry key={p.slug} p={p} />
                    ))}
                </ul>
            </section>
            <section className="section" aria-labelledby="h-ml">
                <h2 id="h-ml">ML &amp; signals</h2>
                <ul className="entries compact">
                    {projectsByGroup("ml").map((p) => (
                        <ProjectEntry key={p.slug} p={p} compact />
                    ))}
                </ul>
            </section>
            <section className="section" aria-labelledby="h-archive">
                <h2 id="h-archive">Archive</h2>
                <ArchiveLine projects={projectsByGroup("archive")} />
            </section>
        </main>
    );
}
