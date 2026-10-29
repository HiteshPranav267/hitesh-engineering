export interface ExperienceEntry {
    role: string;
    org: string;
    period: string;
    summary: string;
    points: string[];
}

export const experience: ExperienceEntry[] = [
    {
        role: "Student Head",
        org: "Joy of Engineering Lab (JoEL), PES University",
        period: "Aug 2024 — Present",
        summary:
            "Engineering leadership for a student lab that runs a flagship hardware hackathon and mentors project teams through a full build cycle.",
        points: [
            "Led backend planning and logistics for HackeZee 2025 and Roadshow 2026.",
            "Coordinated volunteers, mentors, vendors, and technical teams for engineering events.",
            "Mentored multiple student teams on IoT and embedded systems projects.",
            "Developed and maintained the official JoEL website using Next.js and TypeScript.",
        ],
    },
    {
        role: "Research Intern",
        org: "Center for Information Security, Forensics and Cyber Resilience (C-ISFCR)",
        period: "Jun 2025 — Jul 2025",
        summary:
            "Automotive cybersecurity research — building and evaluating a machine-learning intrusion detection system for CAN networks.",
        points: [
            "Developed an ML-based Intrusion Detection System for automotive CAN bus networks",
            "Built a Python firewall for real-time anomaly detection and traffic filtering.",
            "Trained ensemble machine learning models using Scikit-learn.",
            "Developed a Tkinter GUI for CAN message injection, testing, and analytics.",
        ],
    },
];
