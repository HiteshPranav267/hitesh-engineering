import type { Metadata } from "next";
import BackToRoom from "@/components/BackToRoom";
import { formatRange, getExperience } from "@/lib/content";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>Experience</h1>
            <ul className="entries" style={{ marginTop: "2rem" }}>
                {getExperience().map((e) => (
                    <li key={e.id} id={e.id}>
                        <div className="entry-head">
                            <span className="entry-title">{e.role}</span>
                            <span className="meta">{formatRange(e)}</span>
                        </div>
                        <p className="meta" style={{ margin: "0.2rem 0 0" }}>
                            {e.org}
                            {e.place ? `, ${e.place}` : ""}
                        </p>
                        {e.points.length > 0 && (
                            <ul className="measure" style={{ marginTop: "0.7rem" }}>
                                {e.points.map((pt) => (
                                    <li key={pt}>{pt}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
}
