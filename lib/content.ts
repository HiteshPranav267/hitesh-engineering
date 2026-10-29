import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";

const CONTENT = path.join(process.cwd(), "content");

function readYaml<T>(file: string): T {
    return YAML.parse(fs.readFileSync(path.join(CONTENT, file), "utf8")) as T;
}

export interface Profile {
    name: string;
    short_name: string;
    email: string;
    links: { github: string; linkedin: string; website: string };
    status: string;
    education: { school: string; degree: string; period: string; detail: string; source: string }[];
    coursework: { source: string; items: string[] };
    achievements: { text: string; source: string }[];
    certifications: { text: string; source: string }[];
}

export interface ExperienceEntry {
    id: string;
    role: string;
    org: string;
    place: string;
    start: string | null;
    end: string | null;
    calendar: "circle" | "mark" | "none";
    lanyard: boolean;
    source: string;
    points: string[];
}

export interface SkillGroup {
    name: string;
    source: string;
    items: string[];
}

export interface Metric {
    value: string;
    label: string;
    source: string;
}

export interface ProjectImage {
    src: string;
    caption: string;
}

export interface Project {
    slug: string;
    title: string;
    group: "rtl" | "ml" | "archive";
    order: number;
    period?: string;
    stack: string[];
    repo: string;
    private_repo?: boolean;
    links: { label: string; url: string }[];
    scope?: string;
    metrics: Metric[];
    sources: string[];
    images: ProjectImage[];
    body: string;
}

export interface NoteFile {
    stem: string;
    unit: string;
    pdf: string;
    pages: number;
    revised: string;
    topics: { name: string; page: number }[];
}

export interface NoteSubject {
    slug: string;
    subject: string;
    year: number;
    semester: number | null;
    department: string;
    files: NoteFile[];
    pages: number;
    cover: string;
    desk: string;
}

export const getProfile = () => readYaml<Profile>("profile.yaml");
export const getExperience = () => readYaml<{ entries: ExperienceEntry[] }>("experience.yaml").entries;
export const getSkills = () => readYaml<{ groups: SkillGroup[] }>("skills.yaml").groups;
export const getNotes = () => readYaml<{ subjects: NoteSubject[] }>("notes.yaml").subjects;

export function getProjects(): Project[] {
    const dir = path.join(CONTENT, "projects");
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
            const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
            return {
                slug: f.replace(/\.mdx$/, ""),
                stack: [],
                repo: "",
                links: [],
                metrics: [],
                sources: [],
                images: [],
                ...data,
                body: content.trim(),
            } as unknown as Project;
        })
        .sort((a, b) => a.order - b.order);
}

export const projectsByGroup = (group: Project["group"]) => getProjects().filter((p) => p.group === group);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(ym: string | null): string {
    if (!ym) return "";
    if (ym === "present") return "Present";
    const [y, m] = ym.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
}

export function formatRange(e: Pick<ExperienceEntry, "start" | "end">): string {
    const a = formatMonth(e.start);
    const b = formatMonth(e.end);
    return a ? `${a} – ${b}` : b === "Present" ? "Ongoing" : b;
}
