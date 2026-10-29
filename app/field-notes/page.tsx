import type { Metadata } from "next";
import BackToRoom from "@/components/BackToRoom";
import { Placeholder } from "@/components/Mdx";
import { projectsByGroup } from "@/lib/content";

export const metadata: Metadata = { title: "RTL Field Notes" };

const DOCS = [
    { file: "architecture.md", label: "Architecture" },
    { file: "design_decisions.md", label: "Design decisions" },
    { file: "test_plan.md", label: "Test plan" },
];

export default function FieldNotesPage() {
    const withDocs = projectsByGroup("rtl").filter((p) => p.repo);
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>RTL Field Notes</h1>
            <Placeholder />
            <section className="section" aria-labelledby="h-docs">
                <h2 id="h-docs">Design write-ups in the project repositories</h2>
                <ul className="entries compact">
                    {withDocs.map((p) => (
                        <li key={p.slug}>
                            <div className="entry-head">
                                <span className="entry-title">{p.title}</span>
                            </div>
                            <p className="meta" style={{ margin: "0.3rem 0 0" }}>
                                {DOCS.map((d, i) => (
                                    <span key={d.file}>
                                        {i > 0 && " · "}
                                        <a href={`${p.repo}/blob/main/docs/${d.file}`}>{d.label}</a>
                                    </span>
                                ))}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
