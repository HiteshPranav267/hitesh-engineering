import type { MetadataRoute } from "next";
import { getNotes, getProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = ["", "list/", "projects/", "notes/", "library/", "experience/", "cv/", "contact/", "rtl-design-docs/"];
    const projects = getProjects().filter((p) => p.group !== "archive").map((p) => `projects/${p.slug}/`);
    const notes = getNotes().map((s) => `notes/${s.slug}/`);
    return [...pages, ...projects, ...notes].map((p) => ({ url: `${SITE_URL}/${p}` }));
}
