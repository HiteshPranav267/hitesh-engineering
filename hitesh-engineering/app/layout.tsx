import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
    openGraph: {
        title: "Hitesh Pranav Reddy | Portfolio",
        description:
            "Electronics & Communication Engineer | VLSI & Hardware Security | ML & Security",
        type: "website",
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
            </body>
        </html>
    );
}