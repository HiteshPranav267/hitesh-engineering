export interface ProjectLink {
    label: string;
    url: string;
}

export interface Project {
    slug: string;
    title: string;
    tagline: string;
    period: string;
    featured: boolean;
    problem?: string;
    approach?: string;
    highlight?: string;
    outcome?: string;
    stack: string[];
    links: ProjectLink[];
}

export const projects: Project[] = [
    {
        slug: "pesu-research-match",
        title: "PESU ResearchMatch",
        tagline:
            "Hybrid retrieval system that matches students to research faculty by meaning, not just keywords.",
        period: "2026",
        featured: true,
        problem:
            "Finding the right research advisor means reading through dozens of faculty pages. A plain keyword search misses faculty who describe their work in different words, and a black-box LLM answer can't be checked against the underlying data.",
        approach:
            "A hybrid retrieval pipeline combining BGE-Large dense embeddings (1024-dimensional) with BM25 sparse keyword matching, so results capture semantic meaning and exact term matches together. A local Qwen-2.5-0.5B model generates a short explanation for each match. Flask backend, React frontend, with client-side PDF parsing so a resume can be matched directly.",
        highlight:
            "Embeddings, retrieval and explanation generation all run locally instead of calling an external LLM API per query — the system stays self-contained with no per-query dependency on a hosted model.",
        outcome:
            "A working search system across faculty on PES University's RR and EC campuses that returns ranked, explained matches instead of a flat keyword list.",
        stack: ["Python", "Flask", "React", "BGE-Large", "BM25", "Qwen-2.5-0.5B", "Semantic Search"],
        links: [{ label: "GitHub", url: "https://github.com/HiteshPranav267/pesu-research-match" }],
    },
    {
        slug: "automotive-ml-ids",
        title: "Automotive ML IDS",
        tagline:
            "Machine-learning intrusion detection and real-time firewall for automotive CAN networks.",
        period: "2025",
        featured: true,
        problem:
            "CAN bus, the protocol most vehicle components use to talk to each other, has no built-in authentication — any device on the bus can inject messages, which makes it a real attack surface for connected vehicles.",
        approach:
            "An intrusion detection pipeline built around a Random Forest classifier trained to flag anomalous CAN traffic, paired with a real-time Python firewall that can act on detections as they happen. python-can simulates bus traffic and attack scenarios for testing without physical hardware.",
        highlight:
            "The interesting part isn't the classifier — it's closing the loop: detection feeds directly into a firewall that intervenes on live traffic, rather than just flagging anomalies after the fact.",
        outcome:
            "A working detection-and-response pipeline, later extended during a research internship at C-ISFCR into a fuller cybersecurity framework for automotive networks.",
        stack: ["Python", "python-can", "Random Forest", "Anomaly Detection", "CAN Bus", "Automotive Security"],
        links: [{ label: "GitHub", url: "https://github.com/HiteshPranav267/carhackingids" }],
    },
    {
        slug: "motorsport-telemetry",
        title: "Motorsport Telemetry Dashboard",
        tagline: "Real-time motorsport telemetry — IMU, GPS and live video, built in 18 hours.",
        period: "2025",
        featured: true,
        problem:
            "A race team needs to see what's happening to the vehicle as it happens — acceleration, position, speed — not reconstruct it afterward from logs.",
        approach:
            "Built during Ignition 1.0, an 18-hour hackathon run by Team Vegavath PESU and sponsored by Ather Energy. The dashboard streamed live IMU acceleration data (Ax, Ay, Az), GPS-based position tracking and a 720p MJPEG video feed, with speed estimated by fusing IMU and GPS instead of trusting either sensor alone. Driving behavior was inferred from acceleration-variance analysis. Frontend built with Chart.js and Leaflet.",
        highlight:
            "The hardware had to stay light enough not to affect the vehicle it was measuring — it ended up the second-lightest system at the event while still handling live sensor fusion and video.",
        outcome:
            "5th place overall among competing teams, and a working answer to a real constraint: instrumentation that measures a vehicle without meaningfully changing its weight.",
        stack: ["IMU", "GPS", "Sensor Fusion", "Embedded Systems", "JavaScript", "Chart.js", "Leaflet"],
        links: [{ label: "Write-up", url: "https://www.linkedin.com/posts/activity-7394568416873000960-MB9o" }],
    },
    {
        slug: "joy-of-engineering-website",
        title: "Joy of Engineering Lab — Website",
        tagline: "The official website for a student engineering lab, running in production.",
        period: "2025",
        featured: true,
        problem:
            "JoEL needed a real digital presence for its flagship events and student projects, not a placeholder page.",
        approach:
            "Built with Next.js, TypeScript and Tailwind CSS, structured around the lab's actual events — HackeZee and Roadshow — and its student project showcase. Deployed on Vercel with maintainability treated as a first-class requirement, since a different set of students maintains it after handoff.",
        highlight:
            "It isn't a personal or academic project — it's production software a club runs, edited by people who didn't build it.",
        outcome: "Live and in active use as JoEL's official site.",
        stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        links: [{ label: "Live", url: "https://joy-of-engineering.vercel.app" }],
    },
    {
        slug: "orphic",
        title: "orphic",
        tagline:
            "A repository cleanup tool that scans a codebase and flags unused, orphaned and redundant files.",
        period: "2026",
        featured: false,
        problem:
            "A codebase accumulates files nobody remembers adding — old experiments, renamed modules with orphaned originals, assets nothing imports anymore — and there's no fast way to tell what's genuinely unused versus what only looks unused.",
        approach:
            "A CLI tool that scans a repository's import graph and file references to flag unused, orphaned, deprecated, and redundant files, turning a manual audit into a single command.",
        highlight:
            "The hard part isn't finding files — it's telling apart 'nothing references this' from 'this is a dynamic import or config file that looks unreferenced but isn't,' which is where a naive grep-based approach breaks down.",
        outcome:
            "A working cleanup pass that replaces a manual, error-prone audit with one command.",
        stack: ["TypeScript"],
        links: [{ label: "GitHub", url: "https://github.com/HiteshPranav267/orphic" }],
    },
    {
        slug: "llm-atpg-trojan-prioritization",
        title: "LLM-ATPG Trojan Prioritization",
        tagline:
            "Few-shot LLM-based prioritization framework for ATPG-driven hardware Trojan detection — using a language model to triage which test patterns matter most.",
        period: "2025",
        featured: false,
        problem:
            "ATPG (automatic test pattern generation) for hardware Trojan detection can produce more candidate test patterns than there's time to run, and deciding which ones to prioritize has traditionally been a manual, expertise-heavy step.",
        approach:
            "A few-shot LLM-based framework that scores and prioritizes ATPG-generated test patterns by how likely they are to expose a hardware Trojan, using a small number of labeled examples instead of a large fine-tuning dataset.",
        highlight:
            "Most LLM-for-security work targets software — this applies the same reasoning approach to gate-level test generation instead.",
        outcome:
            "A prioritization framework that turns ATPG output into a ranked list worth running first, instead of a flat, unordered one.",
        stack: ["Python", "LLMs", "Hardware Security"],
        links: [{ label: "GitHub", url: "https://github.com/HiteshPranav267/llm-atpg-trojan-prioritization" }],
    },
    {
        slug: "carla-deep-driving",
        title: "CARLA Deep Driving",
        tagline:
            "Deep-learning-based predictive driving model for semi-structured traffic, built on the CARLA simulator.",
        period: "2025",
        featured: false,
        problem:
            "Predictive driving models are usually trained on either fully structured highway data or unstructured open-world data. Semi-structured traffic — lane markings present, rules followed inconsistently — sits in between and is harder to model well.",
        approach:
            "A deep-learning-based predictive driving model built and evaluated in the CARLA simulator, targeting semi-structured traffic scenarios instead of idealized highway conditions.",
        highlight:
            "Using a simulator instead of real vehicle data made it possible to test against scenarios that would be unsafe or impractical to collect on the road.",
        outcome:
            "A working predictive driving model evaluated against simulated semi-structured traffic.",
        stack: ["Python", "Deep Learning", "CARLA"],
        links: [{ label: "GitHub", url: "https://github.com/HiteshPranav267/carla-deep-driving" }],
    },
        {
        slug: "life-os",
        title: "LifeOS",
        tagline:
            "A minimalist personal operating system — productivity, fitness, nutrition, finance and habits in one full-stack app.",
        period: "2026",
        featured: false,
        problem:
            "Tracking a life across five separate apps means five separate places to check, five data models that don't talk to each other, and no single view of what's actually going on.",
        approach:
            "Built as one full-stack application on React, TypeScript and Vite, styled with Tailwind, backed by Supabase and PostgreSQL for auth, storage and sync. Productivity, fitness, nutrition, finance and habits share a single underlying schema instead of five disconnected ones.",
        highlight:
            "Nutrition search is AI-powered rather than a static food database, and the app works local-first — state stays usable offline and syncs back once connectivity returns, instead of stalling on a network call.",
        outcome:
            "A product I use daily in place of five separate apps, with real authentication, data visualization, and a schema I can extend without a redesign every time a new feature shows up.",
        stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL"],
        links: [
            { label: "GitHub", url: "https://github.com/HiteshPranav267/LifeOS" },
        ],
    },
    {
        slug: "hdfc-finance-tracker",
        title: "HDFC Finance Tracker",
        tagline:
            "Automation that reads HDFC Bank transaction-alert emails from Gmail and parses them into structured transaction data.",
        period: "2025",
        featured: false,
        problem:
            "Manually logging every bank transaction into a spreadsheet doesn't scale — by the time you sit down to update it, you've forgotten half of what happened that week.",
        approach:
            "An automation that reads HDFC Bank's transaction-alert emails directly from Gmail and parses them into structured transaction data, removing the manual entry step entirely.",
        highlight:
            "The parsing has to hold up against inconsistent formatting across alert types — debits, credits, UPI, card swipes — since each one is worded slightly differently.",
        outcome:
            "A transaction log that updates itself instead of one that depends on remembering to update it.",
        stack: ["JavaScript", "Automation"],
        links: [{ label: "GitHub", url: "https://github.com/HiteshPranav267/hdfc-finance-tracker" }],
    },
];
