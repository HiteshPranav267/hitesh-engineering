export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    details: string;
    image: string;
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
    },
    {
        slug: "realtime-telemetry-dashboard",
        title: "Real-time Telemetry Dashboard",
        description:
            "Live telemetry visualization dashboard for embedded sensor data streams.",
        tags: ["React", "WebSocket", "TypeScript", "IoT"],
        details:
            "Built a real-time telemetry dashboard capable of ingesting, processing, and visualizing high-frequency sensor streams with a clean minimal UI.",
        image: "/projects/telemetry-dashboard.jpg",
    },
    {
        slug: "embedded-systems-prototypes",
        title: "Embedded Systems Prototypes",
        description:
            "Collection of embedded systems projects exploring hardware-software co-design.",
        tags: ["C", "ARM", "Verilog", "FPGA", "Embedded Systems"],
        details:
            "A portfolio of embedded systems prototypes spanning FPGA-based digital design, ARM microcontroller programming, and hardware-software co-design experiments.",
        image: "/projects/embedded-prototypes.jpg",
    },
];