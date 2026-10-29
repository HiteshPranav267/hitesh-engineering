export interface StackGroup {
    category: string;
    items: string[];
}

export const stack: StackGroup[] = [
    {
        category: "Software",
        items: ["Python", "C / C++", "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Flask"],
    },
    {
        category: "AI / ML",
        items: ["PyTorch", "Scikit-learn", "NLP", "Semantic Search", "Embeddings", "RAG / Hybrid Retrieval"],
    },
    {
        category: "Systems",
        items: ["Linux", "Git", "SystemC", "APIs", "PostgreSQL", "Supabase"],
    },
    {
        category: "Hardware",
        items: ["Arduino", "Raspberry Pi", "FPGA", "Verilog / VHDL", "Embedded Systems", "Sensors / IMU / GPS"],
    },
    {
        category: "Security",
        items: ["CAN Bus Security", "Intrusion Detection", "Anomaly Detection", "Automotive Security"],
    },
];
