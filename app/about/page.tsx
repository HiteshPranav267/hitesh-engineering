import type { Metadata } from "next";
import BackToRoom from "@/components/BackToRoom";
import { Placeholder } from "@/components/Mdx";
import { formatRange, getExperience, getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
    const profile = getProfile();
    const roles = getExperience().filter((e) => e.lanyard);
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>About</h1>
            <Placeholder />
            <section className="section" aria-labelledby="h-facts">
                <h2 id="h-facts">Facts</h2>
                <dl className="facts">
                    <dt>Now</dt>
                    <dd>{profile.status}</dd>
                    {profile.education.map((ed) => (
                        <div key={ed.school} style={{ display: "contents" }}>
                            <dt>{ed.period}</dt>
                            <dd>
                                {ed.degree}, {ed.school}. {ed.detail}
                            </dd>
                        </div>
                    ))}
                    <dt>Next</dt>
                    <dd>Hardware Student Trainee, Samsung Semiconductor India Research, Jan – Jun 2027</dd>
                </dl>
            </section>
            <section className="section" id="roles" aria-labelledby="h-roles">
                <h2 id="h-roles">Roles</h2>
                <ul className="entries compact">
                    {roles.map((r) => (
                        <li key={r.id}>
                            <div className="entry-head">
                                <span className="entry-title">{r.role}</span>
                                <span className="meta">{formatRange(r)}</span>
                            </div>
                            <p className="meta" style={{ margin: "0.2rem 0 0" }}>
                                {r.org}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
