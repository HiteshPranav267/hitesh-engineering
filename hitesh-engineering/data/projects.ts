export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    details: string;
    image: string;
    featured: boolean;
    link: string;
}

export const projects: Project[] = [
    {
        slug: "automotive-ml-ids",
        title: "Automotive ML-based IDS",
        description:
            "Machine learning-powered intrusion detection system for automotive CAN bus networks.",
        tags: ["Python", "Machine Learning", "Automotive Security", "CAN Bus"],
        details:
            "Developed an intelligent intrusion detection system leveraging machine learning algorithms to monitor and detect anomalous behavior in automotive CAN bus communications.",
        image: "/projects/automotive-ids.jpg",
        featured: true,
        link: "https://github.com/HiteshPranav267/carhackingids",
    },
    {
        slug: "hackathon-telemetry-dashboard",
        title: "Motorsport Telemetry Dashboard - Ignition 1.0",
        description:
            "Real-time motorsport telemetry system integrating IMU, GPS, and live video for race-focused analytics.",
        tags: ["IMU", "GPS", "Sensor Fusion", "Embedded Systems", "IoT", "JavaScript", "Chart.js", "Leaflet"],
        details:
            "Developed during Ignition 1.0, an 18-hour flagship hackathon organized by Team Vegavath PESU and sponsored by Ather Energy, this project focused on building a real-time motorsport telemetry system. The dashboard visualized live IMU acceleration data (Ax, Ay, Az), integrated GPS-based vehicle tracking, and implemented speed estimation using IMU + GPS sensor fusion techniques. Activity detection was achieved through acceleration variance analysis, enabling contextual interpretation of driving behavior. The system also supported a live 720p MJPEG video feed for visual telemetry correlation. The frontend dashboard was built using Chart.js, Leaflet, HTML, CSS, and JavaScript, optimized for responsiveness and real-time insights. The hardware prototype maintained a compact footprint and was recognized as the second lightest system at the event. The project secured 5th place overall among competing teams.",
        image: "/projects/telemetry-dashboard.jpg",
        featured: true,
        link: "https://www.linkedin.com/posts/activity-7394568416873000960-MB9o",
    },
    {
        slug: "joy-of-engineering-website",
        title: "Joy of Engineering Lab – Official Website",
        description:
            "Designed and developed the official website for Joy of Engineering Lab (JoEL) to showcase events, projects, and student initiatives.",
        tags: ["Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Web Development",
            "UI/UX",
            "Deployment"],
        details:
            "Developed the official website for Joy of Engineering Lab (JoEL) to establish a structured and professional digital presence for the club. The platform highlights flagship events such as HackeZee and Roadshow, showcases student projects, and provides information about the lab’s mission and activities. Built using a modern web stack with performance and scalability in mind, the site features a clean UI, responsive design, and optimized deployment on Vercel. The project focused on clarity, accessibility, and long-term maintainability, ensuring future teams can easily update content and expand functionality.",
        image: "/projects/joy-of-engineering-website.jpg",
        featured: true,
        link: "https://joy-of-engineering.vercel.app",
    },
    {
        slug: "life-os",
        title: "Life OS – Official Website",
        description:
            "Designed and developed the official website for Life OS to get back control over your life.",
        tags: ["Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Web Development",
            "UI/UX",
            "Deployment"],
        details: "A minimalist utility to capture thoughts, track finances, build habits, and plan your days. Private. Synced. Yours.",
        image: "/projects/life-os.jpg",
        featured: true,
        link: "https://life-track-os.vercel.app",
    },
];