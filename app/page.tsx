import type { Metadata } from "next";
import Room, { type Scene } from "@/components/room/Room";
import { shelfLayout, type Waveform } from "@/components/room/art";
import { getExperience, getNotes } from "@/lib/content";
import scene from "@/content/scene.json";
import wave from "@/content/room/waveform.json";

export const metadata: Metadata = { title: { absolute: "Hitesh Pranav Reddy" } };

export default function RoomPage() {
    const entries = getExperience();
    const now = new Date().toISOString().slice(0, 7); // build month, for "Present"
    // Sticky-note text is factual; replace with photos of handwritten notes later.
    const stickies = [
        ["RTL design", "& verification"],
        ["PES ECE", "2023–27"],
        ["Samsung", "Jan 2027"],
    ];
    const cards = [
        { title: "JoEL", sub: "Student Head", cls: "f-teal" },
        { title: "C-ISFCR", sub: "Research Intern", cls: "f-brick" },
    ];
    return (
        <main id="main">
            <h1 className="sr-only">Hitesh Pranav Reddy — study room</h1>
            <Room scene={scene as unknown as Scene} spines={shelfLayout(getNotes())} wave={wave as unknown as Waveform} entries={entries} now={now} stickies={stickies} cards={cards} />
        </main>
    );
}
