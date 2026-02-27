import type { Metadata } from "next";
import AllProjects from "./AllProjects";

export const metadata: Metadata = {
    title: "Projects | Hitesh Pranav Reddy",
    description: "Browse all projects by Hitesh Pranav Reddy — from automotive security systems to embedded prototypes.",
};

export default function ProjectsPage() {
    return <AllProjects />;
}
