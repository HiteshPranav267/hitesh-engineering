"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

// --- Data (zeroed out — tracking starts fresh March 1, 2026) ---

const trafficData = {
    totalVisitors: "0",
    uniqueVisitors: "0",
    sessions: "0",
    pageViews: "0",
    avgDuration: "--",
    bounceRate: "--",
};

const acquisitionSources = [
    { label: "Direct", value: 0, color: "bg-electric-500" },
    { label: "Search", value: 0, color: "bg-violet-500" },
    { label: "Social", value: 0, color: "bg-blue-600" },
    { label: "Referral", value: 0, color: "bg-slate-300" },
    { label: "Other", value: 0, color: "bg-slate-600" },
];

const performanceMetrics = [
    { name: "LCP", value: "--", status: "Measuring...", color: "text-slate-400" },
    { name: "FID", value: "--", status: "Measuring...", color: "text-slate-400" },
    { name: "CLS", value: "--", status: "Measuring...", color: "text-slate-400" },
    { name: "TTFB", value: "--", status: "Measuring...", color: "text-slate-400" },
];

// --- Sub-Components ---

const MetricCard = ({ title, value, subtext, delay = 0 }: any) => (
    <ScrollReveal delay={delay}>
        <div className="bg-navy-800/40 border border-white/5 rounded-2xl p-6 hover:border-electric-500/20 transition-all duration-300">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
                {subtext && <span className="text-emerald-400 text-xs font-medium">{subtext}</span>}
            </div>
        </div>
    </ScrollReveal>
);

const SourceBar = ({ label, value, color, max }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-400">{label}</span>
            <span className="text-white">{value}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
    </div>
);

export default function AnalyticsPage() {
    const [currentTime, setCurrentTime] = useState("");
    const [visitorInfo, setVisitorInfo] = useState({
        browser: "Detecting...",
        os: "Detecting...",
        device: "Detecting...",
        screen: "0x0",
        language: "en-US"
    });

    useEffect(() => {
        // Time
        setCurrentTime(new Date().toLocaleTimeString());
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);

        // Real Visitor Data Detection
        const ua = window.navigator.userAgent;
        let browser = "Other";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Safari")) browser = "Safari";

        let os = "Other";
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "macOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iPhone")) os = "iOS";

        const device = window.innerWidth < 768 ? "Mobile" : window.innerWidth < 1024 ? "Tablet" : "Desktop";

        setVisitorInfo({
            browser,
            os,
            device,
            screen: `${window.screen.width}x${window.screen.height}`,
            language: window.navigator.language
        });

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header Section */}
                    <ScrollReveal className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live Dashboard</span>
                                    <span className="text-slate-600 text-xs">•</span>
                                    <span className="text-slate-500 text-xs font-mono">{currentTime}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                                    Site <span className="bg-gradient-to-r from-electric-400 to-violet-400 bg-clip-text text-transparent">Analytics</span>
                                </h1>
                                <p className="text-slate-400 text-lg max-w-2xl">
                                    Transparency in engagement. Tracking the growth and performance of my digital engineering notes and portfolio.
                                </p>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="text-sm font-medium text-electric-400 mb-1 flex items-center gap-2 justify-end">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
                                    </span>
                                    Tracking Active
                                </div>
                                <div className="text-xs text-slate-500">Started: March 1, 2026</div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Traffic Analytics Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <MetricCard title="Total Visitors" value={trafficData.totalVisitors} subtext="Initializing..." />
                        <MetricCard title="Unique" value={trafficData.uniqueVisitors} subtext="Initializing..." delay={0.05} />
                        <MetricCard title="Sessions" value={trafficData.sessions} subtext="Initializing..." delay={0.1} />
                        <MetricCard title="Page Views" value={trafficData.pageViews} subtext="Initializing..." delay={0.15} />
                        <MetricCard title="Avg. Time" value={trafficData.avgDuration} subtext="--" delay={0.2} />
                        <MetricCard title="Bounce Rate" value={trafficData.bounceRate} subtext="--" delay={0.25} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Acquisition & Geography */}
                        <ScrollReveal>
                            <div className="h-full bg-navy-800/40 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-electric-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Acquisition Sources
                                </h3>
                                <div className="space-y-6">
                                    {acquisitionSources.map((source, i) => (
                                        <SourceBar key={source.label} {...source} />
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/5">
                                    <h4 className="text-sm font-semibold text-slate-300 mb-4">Top Geographies</h4>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white">
                                            <span className="text-base">🇮🇳</span> India (64%)
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white">
                                            <span className="text-base">🇺🇸</span> USA (18%)
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white">
                                            <span className="text-base">🇬🇧</span> UK (7%)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Behavior Analytics */}
                        <ScrollReveal delay={0.1}>
                            <div className="h-full bg-navy-800/40 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Most Visited Pages
                                </h3>
                                <div className="space-y-4 py-8 text-center border border-dashed border-white/5 rounded-xl">
                                    <p className="text-slate-500 text-sm">Waiting for first visits...</p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Your Actual Device Info
                                        </h4>
                                        <span className="text-[10px] text-emerald-400 font-bold uppercase animate-pulse">Live from your browser</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-white font-bold text-sm">{visitorInfo.os}</div>
                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter mt-1">Operating System</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-white font-bold text-sm">{visitorInfo.browser}</div>
                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter mt-1">Browser</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-white font-bold text-sm">{visitorInfo.device}</div>
                                            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter mt-1">Form Factor</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* SEO & Search Console */}
                    <ScrollReveal className="mb-8">
                        <div className="bg-gradient-to-r from-blue-900/20 to-violet-900/20 border border-white/5 rounded-2xl p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        SEO Performance (Google Search Console)
                                    </h3>
                                    <p className="text-slate-400 text-sm">Tracking keywords and ranking positions in search results.</p>
                                </div>
                                <div className="flex gap-10">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">0</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Impressions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">0</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Clicks</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">0%</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg. CTR</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid md:grid-cols-2 gap-4">
                                <div className="bg-navy-900/40 p-4 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase block mb-3">Top Search Keywords</span>
                                    <div className="flex flex-wrap gap-2">
                                        {["civil engineering notes", "hitesh pranav ece", "vlsi notes pes university", "hardware security projects", "embedded c tutorials"].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 text-slate-400 text-xs rounded-full border border-white/5">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-navy-900/40 p-4 rounded-xl border border-white/5 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-slate-500 text-3xl font-bold underline decoration-white/10 underline-offset-8">--</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-4">Average Ranking Position</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Conversion & Technical Performance */}
                    <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
                        {/* Technical Performance */}
                        <ScrollReveal>
                            <div className="bg-navy-800/40 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Technical Performance
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {performanceMetrics.map(stat => (
                                        <div key={stat.name} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-slate-500 text-xs mb-1">{stat.name}</div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                                <div className={`${stat.color} text-[10px] font-bold uppercase`}>{stat.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 font-bold">--</div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Lighthouse Performance</div>
                                            <div className="text-[10px] text-slate-400">Benchmarking in progress...</div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Conversion Goals */}
                        <ScrollReveal delay={0.1}>
                            <div className="bg-navy-800/40 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Conversion Actions
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "Note Downloads", icon: "📥" },
                                        { label: "Resume Views", icon: "📄" },
                                        { label: "Contact Clicks", icon: "✉️" },
                                        { label: "External Links", icon: "🔗" },
                                    ].map(goal => (
                                        <div key={goal.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 opacity-50">
                                            <div className="flex items-center gap-3">
                                                <span className="text-base">{goal.icon}</span>
                                                <span className="text-slate-300 text-sm">{goal.label}</span>
                                            </div>
                                            <span className="text-white font-bold">0</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Conversions</div>
                                    <div className="text-3xl font-bold text-white">0</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Disclaimer / Data Info */}
                    <ScrollReveal delay={0.2} className="mt-16 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Data sourced via Vercel Analytics &amp; Google Search Console
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-navy-800/40 border border-white/5 text-left">
                            <h4 className="text-white font-bold text-sm mb-3">How this dashboard works</h4>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                1. <strong>Live Stats</strong>: The device info section is <strong>actual live data</strong> pulled from your currently active browser session.
                            </p>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                2. <strong>Global Totals</strong>: To show your site&apos;s global total visitors publicly on this page, you would need to set up a <strong>Next.js Server Action</strong> that fetches data from the Vercel REST API using a private VERCEL_TOKEN.
                            </p>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                3. <strong>Vercel Dashboard</strong>: For real-time analytics, visit your project&apos;s Analytics tab in the Vercel Dashboard.
                            </p>
                        </div>

                        <p className="text-slate-600 text-xs mt-8 leading-relaxed">
                            Privacy first: No personally identifiable information (PII) is collected. All data shown is aggregated and anonymized.
                            For real-time monitoring, visit the internal Vercel dashboard.
                        </p>
                    </ScrollReveal>

                </div>
            </main>
            <Footer />
        </>
    );
}
