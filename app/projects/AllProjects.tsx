"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Projects from "@/components/Projects";
import OtherWork from "@/components/OtherWork";
import ScrollReveal from "@/components/ScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AllProjects() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <ScrollReveal>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-faint hover:text-paper transition-colors text-sm mb-6"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-paper mb-4">
                            All Projects
                        </h1>
                        <p className="text-muted text-lg max-w-2xl">
                            Everything from featured case studies to smaller explorations — pulled from
                            the same list shown on the homepage, so it never falls out of sync.
                        </p>
                    </ScrollReveal>
                </div>
            </main>

            <Projects />
            <OtherWork />

            <div className="py-16">
                <ScrollReveal className="flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-md border border-white/12 text-muted font-medium hover:text-paper hover:border-white/25 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </ScrollReveal>
            </div>

            <Footer />
        </>
    );
}
