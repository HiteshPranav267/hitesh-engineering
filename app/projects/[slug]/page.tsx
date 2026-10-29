import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToRoom from "@/components/BackToRoom";
import Mdx from "@/components/Mdx";
import { getProjects } from "@/lib/content";
import { asset } from "@/lib/site";

export const dynamicParams = false;

const pages = () => getProjects().filter((p) => p.group !== "archive");

export function generateStaticParams() {
    return pages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const p = pages().find((x) => x.slug === slug);
    return { title: p?.title ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const p = pages().find((x) => x.slug === slug);
    if (!p) notFound();
    return (
        <main id="main" className="page">
            <BackToRoom />
            <p className="meta">{p.group === "rtl" ? "RTL design & verification" : "ML & signals"}{p.period ? ` · ${p.period}` : ""}</p>
            <h1 style={{ marginTop: "0.4rem" }}>{p.title}</h1>
            <dl className="facts">
                <dt>Stack</dt>
                <dd>{p.stack.join(", ")}</dd>
                {p.scope && (
                    <>
                        <dt>Scope &amp; limits</dt>
                        <dd>{p.scope}</dd>
                    </>
                )}
                {p.metrics.map((m) => (
                    <div key={m.label} style={{ display: "contents" }}>
                        <dt>Result</dt>
                        <dd>
                            <strong>{m.value}</strong> {m.label}
                        </dd>
                    </div>
                ))}
                <dt>Code</dt>
                <dd>
                    {p.repo ? <a href={p.repo}>{p.repo.replace("https://", "")}</a> : p.private_repo ? "Private repository" : "No public repository"}
                    {p.links.map((l) => (
                        <span key={l.url}>
                            {" · "}
                            <a href={l.url}>{l.label}</a>
                        </span>
                    ))}
                </dd>
            </dl>
            {p.images.map((img) => (
                <figure key={img.src} className="figure">
                    <img src={asset(img.src)} alt={img.caption} loading="lazy" />
                    <figcaption className="meta">{img.caption}</figcaption>
                </figure>
            ))}
            <Mdx source={p.body} />
        </main>
    );
}
