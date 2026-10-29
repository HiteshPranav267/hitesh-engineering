import type { Metadata } from "next";
import NotesPage from "./NotesPage";

export const metadata: Metadata = {
    title: "Notes | Hitesh Pranav Reddy",
    description:
        "A curated collection of engineering notes — ECE, CS, Physics, Math, and more — from PES University. Free to use and share.",
};

export default function Notes() {
    return <NotesPage />;
}
