export const resumeData = {
    name: "Duggireddy Hitesh Pranav Reddy",
    title: "Systems Engineer — Software, Hardware & AI",
    contact: {
        email: "hiteshpranavreddy.d@gmail.com",
        phone: "+91 8296465473",
        location: "Bengaluru, India",
        linkedin: "linkedin.com/in/hitesh-pranav-reddy-379371264",
        github: "github.com/HiteshPranav267",
    },
    education: [
        {
            degree: "B.Tech — Electronics & Communication Engineering",
            institution: "PES University, Bengaluru",
            period: "2023 – 2027",
            details: "CGPA: 8.49",
        },
        {
            degree: "High School Secondary Education",
            institution: "Sri Chaitanya College of Education",
            period: "2011 – 2023",
            details: "Completed my schooling with 83.2% in Class 10 and 91.4% in Class 12 (Science). Percentage: 95%",
        },
    ],
    experience: [
        {
            role: "Student Head",
            company: "Joy of Engineering Lab (JoEL), PES University",
            period: "August 2024 – Present",
            bullets: [
                "Led technical coordination and backend planning for HackeZee 2025, JoEL's flagship hardware hackathon.",
                "Mentored 6+ teams on IoT-based projects, guiding design, implementation, and debugging processes.",
                "Built and maintain the lab's official website, and coordinated logistics and stakeholder communication across students, vendors, and university staff for multiple events.",
            ],
        },
        {
            role: "Research Intern",
            company: "Center for Information Security, Forensics and Cyber Resilience (C-ISFCR)",
            period: "June 2025 – July 2025",
            bullets: [
                "Collaborated with a team to develop a modular cybersecurity framework for automotive networks.",
                "Designed and implemented a full-stack intrusion detection system (IDS) using machine learning models.",
                "Integrated a real-time Python-based firewall with an ensemble of models to enhance vehicular safety.",
                "Created a Tkinter-based GUI for controlled CAN message injection and post-attack analytics visualization.",
            ],
        },
    ],
    skills: [
        { category: "Software", items: ["Python", "C / C++", "TypeScript", "JavaScript", "React", "Next.js", "Flask"] },
        { category: "AI / ML", items: ["PyTorch", "Scikit-learn", "NLP", "Semantic Search", "Hybrid Retrieval"] },
        { category: "Systems", items: ["Linux", "Git", "SystemC", "PostgreSQL", "APIs"] },
        { category: "Hardware", items: ["FPGA", "Verilog / VHDL", "Arduino / Raspberry Pi", "IMU / GPS Sensors"] },
        { category: "Security", items: ["CAN Bus Security", "Intrusion Detection", "Anomaly Detection"] },
    ],
    projects: [
        {
            title: "LifeOS",
            period: "2026",
            tech: "React, TypeScript, Vite, Supabase, PostgreSQL",
            bullets: [
                "Built a full-stack personal operating system unifying productivity, fitness, nutrition, finance, and habit tracking on one schema.",
                "Implemented Supabase authentication, local-first sync, and AI-powered nutrition search.",
            ],
        },
        {
            title: "PESU ResearchMatch",
            period: "2026",
            tech: "Python, Flask, React, BGE-Large, BM25",
            bullets: [
                "Built a hybrid retrieval pipeline combining BGE-Large dense embeddings (1024-dim) with BM25 keyword matching for faculty search.",
                "Integrated a local Qwen-2.5-0.5B model to generate per-match explanations without external API calls.",
            ],
        },
        {
            title: "Automotive ML IDS",
            period: "2025",
            tech: "Python, python-can, Random Forest",
            bullets: [
                "Developed a machine-learning intrusion detection system for automotive CAN bus networks.",
                "Integrated a real-time Python-based firewall with ensemble models to enhance vehicular safety.",
            ],
        },
        {
            title: "Motorsport Telemetry Dashboard — Ignition 1.0",
            period: "2025",
            tech: "JavaScript, Chart.js, Leaflet, IMU, GPS",
            bullets: [
                "Built a real-time telemetry system integrating IMU acceleration data, GPS tracking, and IMU+GPS sensor-fusion speed estimation.",
                "Recognized as the 2nd-lightest hardware system at Ignition 1.0 (sponsored by Ather Energy); placed 5th overall.",
            ],
        },
        {
            title: "Joy of Engineering Lab — Website",
            period: "2025",
            tech: "Next.js, TypeScript, Tailwind CSS",
            bullets: [
                "Designed and built the official website for JoEL, showcasing flagship events HackeZee and Roadshow.",
                "Deployed on Vercel with a focus on clarity, accessibility, and long-term maintainability by future teams.",
            ],
        },
    ],
};
