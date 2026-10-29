import type { Metadata } from "next";
import BackToRoom from "@/components/BackToRoom";
import PrintButton from "@/components/PrintButton";
import { formatRange, getExperience, getProfile, getProjects, getSkills } from "@/lib/content";
import { asset } from "@/lib/site";

export const metadata: Metadata = { title: "CV" };

// Fact bullets only: the "## Facts" list of each project file.
function facts(body: string): string[] {
    const block = body.split(/^## Facts\s*$/m)[1] ?? "";
    return block
        .split(/^## /m)[0]
        .split("\n")
        .filter((l) => l.startsWith("- "))
        .map((l) => l.slice(2).trim());
}

export default function CvPage() {
    const p = getProfile();
    const experience = getExperience();
    const projects = getProjects();
    const rtl = projects.filter((x) => x.group === "rtl");
    const other = projects.filter((x) => x.group === "ml");
    return (
        <main id="main" className="page">
            <div className="cv">
                <BackToRoom />
                <p className="meta no-print">
                    <a href={asset("Resume_Duggireddy_Hitesh_Pranav_Reddy.pdf")}>Download PDF</a> · <PrintButton />
                </p>
                <h1>{p.name}</h1>
                <p className="meta" style={{ marginTop: "0.4rem" }}>
                    <a href={`mailto:${p.email}`}>{p.email}</a> · <a href={p.links.github}>github.com/HiteshPranav267</a> ·{" "}
                    <a href={p.links.linkedin}>linkedin.com/in/hitesh-pranav-reddy-379371264</a> ·{" "}
                    <a href={p.links.website}>hiteshpranav267.github.io/hitesh-engineering</a>
                </p>

                <section className="section">
                    <h2>Education</h2>
                    <ul className="entries">
                        {p.education.map((e) => (
                            <li key={e.school}>
                                <div className="entry-head">
                                    <span className="entry-title">{e.degree}</span>
                                    <span className="meta">{e.period}</span>
                                </div>
                                <p style={{ margin: "0.15rem 0 0" }}>
                                    {e.school} — {e.detail}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.94rem" }}>
                        <span className="meta">Relevant coursework </span>
                        {p.coursework.items.join("; ")}
                    </p>
                </section>

                <section className="section">
                    <h2>Experience</h2>
                    <ul className="entries">
                        {experience.map((e) => (
                            <li key={e.id}>
                                <div className="entry-head">
                                    <span className="entry-title">
                                        {e.role} — {e.org}
                                    </span>
                                    <span className="meta">{formatRange(e)}</span>
                                </div>
                                {e.points.length > 0 && (
                                    <ul style={{ marginTop: "0.3rem" }}>
                                        {e.points.map((pt) => (
                                            <li key={pt}>{pt}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="section">
                    <h2>RTL design &amp; verification projects</h2>
                    <ul className="entries">
                        {rtl.map((x) => (
                            <li key={x.slug}>
                                <div className="entry-head">
                                    <span className="entry-title">{x.title}</span>
                                    <span className="meta">{x.stack.join(" · ")}</span>
                                </div>
                                <ul style={{ marginTop: "0.3rem" }}>
                                    {facts(x.body).map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="section">
                    <h2>Other projects</h2>
                    <ul className="entries">
                        {other.map((x) => (
                            <li key={x.slug}>
                                <div className="entry-head">
                                    <span className="entry-title">{x.title}</span>
                                    <span className="meta">{x.stack.slice(0, 4).join(" · ")}</span>
                                </div>
                                <p style={{ margin: "0.15rem 0 0", fontSize: "0.94rem" }}>{facts(x.body)[0]}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="section">
                    <h2>Skills</h2>
                    <dl className="facts">
                        {getSkills().map((g) => (
                            <div key={g.name} style={{ display: "contents" }}>
                                <dt>{g.name}</dt>
                                <dd>{g.items.join(", ")}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section className="section">
                    <h2>Achievements &amp; certifications</h2>
                    <ul style={{ marginTop: "0.6rem" }}>
                        {[...p.achievements, ...p.certifications].map((a) => (
                            <li key={a.text}>{a.text}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
