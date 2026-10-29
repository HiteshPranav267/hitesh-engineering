import type { Metadata } from "next";
import BackToRoom from "@/components/BackToRoom";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
    const p = getProfile();
    return (
        <main id="main" className="page">
            <BackToRoom />
            <h1>Contact</h1>
            <dl className="facts" style={{ marginTop: "2rem" }}>
                <dt>Email</dt>
                <dd>
                    <a href={`mailto:${p.email}`}>{p.email}</a>
                </dd>
                <dt>GitHub</dt>
                <dd>
                    <a href={p.links.github}>{p.links.github.replace("https://", "")}</a>
                </dd>
                <dt>LinkedIn</dt>
                <dd>
                    <a href={p.links.linkedin}>{p.links.linkedin.replace("https://www.", "")}</a>
                </dd>
            </dl>
        </main>
    );
}
