import Link from "next/link";
import ProjectEntry from "@/components/ProjectEntry";
import { formatRange, getExperience, getProfile, projectsByGroup } from "@/lib/content";

export default function Home() {
    const profile = getProfile();
    const rtl = projectsByGroup("rtl");
    const ml = projectsByGroup("ml");
    const experience = getExperience().filter((e) => e.calendar !== "none");
    return (
        <main id="main" className="page">
            <h1>{profile.short_name}</h1>
            <p className="lede">{profile.status}</p>
            <Link className="room-link meta" href="/">
                Back to the room →
            </Link>

            <section className="section" aria-labelledby="h-rtl">
                <h2 id="h-rtl">RTL design &amp; verification</h2>
                <ul className="entries">
                    {rtl.map((p) => (
                        <ProjectEntry key={p.slug} p={p} />
                    ))}
                </ul>
            </section>

            <section className="section" aria-labelledby="h-ml">
                <h2 id="h-ml">ML &amp; signals</h2>
                <ul className="entries compact">
                    {ml.map((p) => (
                        <ProjectEntry key={p.slug} p={p} compact />
                    ))}
                </ul>
            </section>

            <section className="section" aria-labelledby="h-exp">
                <h2 id="h-exp">Experience</h2>
                <ul className="entries compact">
                    {experience.map((e) => (
                        <li key={e.id}>
                            <div className="entry-head">
                                <span className="entry-title">
                                    {e.role}, {e.org}
                                </span>
                                <span className="meta">{formatRange(e)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="meta" style={{ marginTop: "0.8rem" }}>
                    <Link href="/experience/">Full timeline</Link> · <Link href="/cv/">CV</Link> · <Link href="/notes/">Handwritten notes</Link>
                </p>
            </section>
        </main>
    );
}
