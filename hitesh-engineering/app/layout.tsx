import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./global.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
});

export const metadata: Metadata = {
    title: "Hitesh Pranav Reddy | Portfolio",
    description:
        "Electronics & Communication Engineer specializing in VLSI, Hardware Security, and Machine Learning.",
    keywords: ["Hitesh Pranav Reddy", "Portfolio", "ECE Engineer", "Hardware Security", "VLSI Design", "Machine Learning", "Cyber Security"],
    authors: [{ name: "Hitesh Pranav Reddy" }],
    creator: "Hitesh Pranav Reddy",
    openGraph: {
        title: "Hitesh Pranav Reddy | Portfolio",
        description:
            "Portfolio of Hitesh Pranav Reddy - Electronics & Communication Engineer specializing in VLSI, Hardware Security, and ML.",
        url: 'https://hitesh-pranav.vercel.app',
        siteName: 'Hitesh Pranav Reddy Portfolio',
        locale: 'en_US',
        type: 'website',
    },
    verification: {
        google: 'jLd95OrsDzo_uik_gs_23P9WohEKStyvcoRGeDjLIG4',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Hitesh Pranav Reddy | Portfolio",
        description: "Electronics & Communication Engineer | VLSI & Hardware Security | ML & Cyber Security",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="font-sans antialiased bg-navy-900 text-slate-200 min-h-screen">
                {children}
                <Analytics />
            </body>
        </html>
    );
}