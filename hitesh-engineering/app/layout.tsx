import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./global.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    title: "Hitesh Pranav Reddy | Software, Hardware & AI",
    description:
        "I'm an Electronics & Communication Engineer at PES University building across software, hardware, and AI — full-stack products, embedded systems, and applied machine learning.",
    keywords: ["Hitesh Pranav Reddy", "Systems Engineer", "Software Engineer", "Embedded Systems", "Machine Learning", "AI Engineer", "PES University", "Full Stack Developer"],
    authors: [{ name: "Hitesh Pranav Reddy" }],
    creator: "Hitesh Pranav Reddy",
    openGraph: {
        title: "Hitesh Pranav — Engineer | Software, Hardware & AI",
        description:
            "An ECE engineer building across software, hardware, and AI. Full-stack products, embedded systems, and applied machine learning.",
        url: 'https://hiteshpranav267.github.io/hitesh-engineering',
        siteName: 'Hitesh Pranav — Systems Engineer',
        locale: 'en_US',
        type: 'website',
    },
    verification: {
        google: 'jLd95OrsDzo_uik_gs_23P9WohEKStyvcoRGeDjLIG4',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Hitesh Pranav — Systems Engineer | Software, Hardware & AI",
        description: "Building across software, hardware & AI. ECE @ PES University.",
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/hitesh-engineering/favicon.png?v=1",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="font-sans antialiased bg-ink-950 text-paper min-h-screen">
                {children}
            </body>
        </html>
    );
}