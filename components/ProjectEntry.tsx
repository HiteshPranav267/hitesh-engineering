import Link from "next/link";
import type { Project } from "@/lib/content";

export default function ProjectEntry({ p, compact = false }: { p: Project; compact?: boolean }) {
    return (
        <li>
            <div className="entry-head">
                <span className="entry-title">
                    <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
                </span>
                <span className="meta">{p.stack.join(" · ")}</span>
            </div>
            {!compact && p.scope && (
                <p className="scope">
                    <b>Scope &amp; limits</b>
                    {p.scope}
                </p>
            )}
            {p.metrics.map((m) => (
                <p key={m.label} className="metric-line">
                    <strong>{m.value}</strong> {m.label}
                </p>
            ))}
        </li>
    );
}

export function ArchiveLine({ projects }: { projects: Project[] }) {
    return (
        <p className="inline-list">
            {projects.map((p, i) => {
                const href = p.repo || p.links[0]?.url;
                return (
                    <span key={p.slug}>
                        {i > 0 && " · "}
                        {href ? <a href={href}>{p.title}</a> : p.title}
                    </span>
                );
            })}
        </p>
    );
}
