"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, FileText, FolderOpen, ExternalLink, Layers, Plus } from "lucide-react";
import { resources, Resource } from "@/data/resources";
import { GithubIcon } from "@/components/BrandIcons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showHiteshOnly, setShowHiteshOnly] = useState(false);

    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["Year 1", "Year 2", "Year 3", "Year 4"]));

    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const matchesSearch =
                res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (res.tags && res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
            const matchesHitesh = !showHiteshOnly || res.isHiteshNotes;
            return matchesSearch && matchesHitesh;
        });
    }, [searchQuery, showHiteshOnly]);

    const groupedResources = useMemo(() => {
        const hierarchy: any = {};

        filteredResources.forEach(res => {
            const y = `Year ${res.year}`;
            const d = res.department;
            const s = res.subject;

            if (!hierarchy[y]) hierarchy[y] = {};
            if (!hierarchy[y][d]) hierarchy[y][d] = {};
            if (!hierarchy[y][d][s]) hierarchy[y][d][s] = [];

            hierarchy[y][d][s].push(res);
        });

        return hierarchy;
    }, [filteredResources]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const newExpanded = new Set<string>();
            Object.keys(groupedResources).forEach(y => {
                newExpanded.add(y);
                Object.keys(groupedResources[y]).forEach(d => {
                    newExpanded.add(`${y}-${d}`);
                    Object.keys(groupedResources[y][d]).forEach(s => {
                        newExpanded.add(`${y}-${d}-${s}`);
                    });
                });
            });
            setExpandedSections(newExpanded);
        }
    }, [groupedResources, searchQuery]);

    const toggleSection = (id: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const stats = {
        total: resources.length,
        filtered: filteredResources.length
    };

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 min-h-screen bg-ink-950">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Capstone support banner */}
                    <ScrollReveal className="mb-6">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 rounded-lg border border-white/10 p-6 md:p-8">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                                    <h3 className="text-base font-medium text-paper">
                                        Facing capstone challenges?
                                    </h3>
                                </div>
                                <p className="text-muted text-sm max-w-xl leading-relaxed">
                                    Finding the right research mentor shouldn&apos;t be a hurdle — I built a
                                    dedicated platform to help you connect with expert mentors.
                                </p>
                            </div>

                            <a
                                href="https://huggingface.co/spaces/HiteshPranav/research-match"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-paper text-ink-950 rounded-md text-sm font-medium hover:bg-accent-400 transition-colors"
                            >
                                Find a Mentor
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </ScrollReveal>

                    {/* Support banner */}
                    <ScrollReveal className="mb-16">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 rounded-lg border border-white/10 p-6 md:p-8">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                                    <h3 className="text-base font-medium text-paper">Feeling generous?</h3>
                                </div>
                                <p className="text-muted text-sm max-w-xl leading-relaxed">
                                    If these resources helped, consider supporting the work — contributions
                                    keep this repository alive and updated.
                                </p>
                            </div>

                            <a
                                href="/hitesh-engineering/notes/upi_qr.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-white/12 rounded-md text-sm text-muted font-medium hover:text-paper hover:border-white/25 transition-colors"
                            >
                                Support via UPI
                            </a>
                        </div>
                    </ScrollReveal>

                    {/* Header */}
                    <ScrollReveal className="mb-16">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
                                Live Repository
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-paper mb-5">
                            Notes &amp; resources
                        </h1>
                        <p className="text-muted text-lg max-w-2xl leading-relaxed mb-8">
                            {stats.total} technical resources — hand-written notes, textbook archives, and
                            core curriculum guides from PES University. Free to use and share.
                        </p>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                            <div className="font-mono text-sm text-paper">
                                {stats.filtered} <span className="text-faint">resources found</span>
                            </div>
                            <button
                                onClick={() => setShowHiteshOnly(!showHiteshOnly)}
                                className={`flex items-center gap-2 text-sm transition-colors ${showHiteshOnly ? "text-accent-400" : "text-muted hover:text-paper"
                                    }`}
                            >
                                <span
                                    className={`w-3.5 h-3.5 rounded-full border transition-colors flex items-center justify-center ${showHiteshOnly ? "bg-accent-500 border-accent-500" : "border-white/20"
                                        }`}
                                >
                                    {showHiteshOnly && <span className="w-1.5 h-1.5 bg-ink-950 rounded-full" />}
                                </span>
                                Hitesh&apos;s Notes only
                            </button>
                            <button
                                onClick={() => setExpandedSections(new Set())}
                                className="text-sm text-faint hover:text-muted transition-colors"
                            >
                                Collapse all
                            </button>
                        </div>
                    </ScrollReveal>

                    {/* Search */}
                    <div className="max-w-2xl mb-16 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
                        <input
                            type="text"
                            placeholder="Search by subject, code, or topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-ink-900 border border-white/10 rounded-md pl-11 pr-11 py-3.5 text-paper placeholder:text-faint focus:outline-none focus:border-accent-500/50 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-faint hover:text-paper transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Resource tree */}
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {Object.keys(groupedResources).sort().map((year) => (
                                <YearSection
                                    key={year}
                                    id={year}
                                    title={year}
                                    departments={groupedResources[year]}
                                    isExpanded={expandedSections.has(year)}
                                    onToggle={() => toggleSection(year)}
                                    expandedSections={expandedSections}
                                    toggleSection={toggleSection}
                                />
                            ))}
                        </AnimatePresence>

                        {stats.filtered === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 border border-dashed border-white/10 rounded-lg"
                            >
                                <h3 className="text-paper text-xl font-medium mb-3">No results</h3>
                                <p className="text-muted max-w-sm mx-auto mb-8 leading-relaxed">
                                    Nothing matches &ldquo;<span className="text-paper">{searchQuery}</span>&rdquo;. Try a different query.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setShowHiteshOnly(false); }}
                                    className="px-6 py-2.5 border border-white/12 rounded-md text-sm text-muted hover:text-paper hover:border-white/25 transition-colors"
                                >
                                    Reset filters
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Request footer */}
                    <div className="mt-24 max-w-2xl mx-auto text-center py-16 border-t border-white/8">
                        <h4 className="text-paper text-2xl font-semibold tracking-tight mb-4">Missing something?</h4>
                        <p className="text-muted mb-8 leading-relaxed">
                            This repository grows through requests. If a note or textbook is missing,
                            reach out and I&apos;ll add it.
                        </p>
                        <a
                            href="mailto:hiteshpranavreddy.d@gmail.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-paper text-ink-950 rounded-md text-sm font-medium hover:bg-accent-400 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Request a resource
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function YearSection({ id, title, departments, isExpanded, onToggle, expandedSections, toggleSection }: any) {
    const totalResources = Object.values(departments).reduce((acc: number, dept: any) =>
        acc + Object.values(dept).reduce((a: number, s: any) => a + s.length, 0), 0
    );

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-ink-900 transition-colors duration-200 text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${isExpanded ? "bg-accent-500 text-ink-950" : "bg-ink-900 text-muted"
                        }`}>
                        <Layers className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-paper">{title}</h2>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint mt-0.5">
                            {Object.keys(departments).length} departments · {totalResources} resources
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-faint transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="border-t border-white/8 px-5 md:px-6 pb-6 pt-4 space-y-4"
                    >
                        {Object.keys(departments).sort().map((dept) => (
                            <DeptSection
                                key={dept}
                                id={`${id}-${dept}`}
                                title={dept}
                                subjects={departments[dept]}
                                isExpanded={expandedSections.has(`${id}-${dept}`)}
                                onToggle={() => toggleSection(`${id}-${dept}`)}
                                expandedSections={expandedSections}
                                toggleSection={toggleSection}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DeptSection({ id, title, subjects, isExpanded, onToggle, expandedSections, toggleSection }: any) {
    const totalResources = Object.values(subjects).reduce((acc: number, s: any) => acc + s.length, 0);

    return (
        <div className="pl-4 border-l border-white/8">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 rounded-md hover:bg-ink-900 transition-colors duration-200"
            >
                <div className="flex items-center gap-3">
                    <FolderOpen className={`w-4 h-4 transition-colors ${isExpanded ? "text-accent-400" : "text-faint"}`} />
                    <div className="text-left">
                        <h3 className="text-sm font-medium text-paper">{title}</h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                            {Object.keys(subjects).length} subjects · {totalResources} resources
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-faint transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-2 space-y-3 pr-1"
                    >
                        {Object.keys(subjects).sort().map((subject) => (
                            <SubjectSection
                                key={subject}
                                id={`${id}-${subject}`}
                                title={subject}
                                resources={subjects[subject]}
                                isExpanded={expandedSections.has(`${id}-${subject}`)}
                                onToggle={() => toggleSection(`${id}-${subject}`)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SubjectSection({ title, resources, isExpanded, onToggle }: any) {
    return (
        <div className="ml-2 pl-4 border-l border-white/8">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors duration-200 ${isExpanded ? "bg-ink-900 text-paper" : "text-muted hover:text-paper hover:bg-ink-900"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <FileText className="w-3.5 h-3.5 text-faint" />
                    <span className="text-sm font-medium">{title}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-faint">
                        {resources.length}
                    </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-faint transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 grid sm:grid-cols-2 gap-3 pb-4"
                    >
                        {resources.map((res: Resource, i: number) => (
                            <ResourceCard key={res.id} res={res} index={i} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ResourceCard({ res, index }: { res: Resource, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 10) * 0.02 }}
        >
            <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full border border-white/10 rounded-md p-5 hover:border-accent-500/40 hover:bg-ink-900 transition-all duration-200"
            >
                <div className="flex items-start justify-between mb-4">
                    <ResourceTypeIcon type={res.type} />
                    {res.isHiteshNotes && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-400 text-[10px] font-mono uppercase tracking-wider">
                            Hitesh
                        </span>
                    )}
                </div>

                <h4 className="text-paper text-sm font-medium mb-2 leading-snug line-clamp-2">
                    {res.title}
                </h4>

                <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/8">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                        {res.type}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-faint opacity-0 group-hover:opacity-100 group-hover:text-accent-400 transition-all" />
                </div>
            </a>
        </motion.div>
    );
}

function ResourceTypeIcon({ type }: { type: Resource["type"] }) {
    if (type === "GitHub") {
        return <GithubIcon className="w-4 h-4 text-faint" />;
    }
    return <FileText className="w-4 h-4 text-faint" />;
}
