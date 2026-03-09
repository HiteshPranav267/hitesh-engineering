import { projects } from "./projects";

export const resumeData = {
    name: "Duggireddy Hitesh Pranav Reddy",
    title: "ECE | VLSI & Hardware Security | ML & Cyber Security",
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
                "Contributed to the backend planning and technical coordination of HackeZee 2025, JoEL's flagship hardware hackathon.",
                "Assisted in event logistics, participant support, and mentoring, ensuring a smooth experience for all attendees for multiple events",
                "Mentored 6+ teams on IoT based projects, guiding them through design, implementation, and debugging processes.",
            ],
        },
        {
            role: "Research Intern",
            company: "Center for Information Security, Forensics and Cyber Resilience (C-ISFCR)",
            period: "June 2025 – July 2025",
            bullets: [
                "Collaborated with a team to develop a modular cybersecurity framework for automotive networks.",
                "Design and implemented a full-stack intrusion detection system (IDS) using machine learning models.",
                "Integrated a real-time Python-based firewall with an ensemble of models to enhance vehicular safety.",
                "Created a Tkinter-based GUI for controlled CAN message injection and post-attack analytics visualization.",
            ],
        },
    ],
    skills: [
        { category: "Languages", items: ["Python", "C / C++", "Verilog / VHDL"] },
        { category: "Hardware", items: ["FPGA", "Arduino/RPi"] },
        { category: "ML & Security", items: ["Scikit-learn", "PyTorch", "IDS / Anomaly Detection", "CAN Bus Security"] },
        { category: "Tools", items: ["Git", "Vivado", "Linux"] },
    ],
    projects: projects.map(p => ({
        title: p.title,
        period: p.period,
        tech: p.tags.slice(0, 5).join(", "),
        bullets: p.bullets
    }))
};
