"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resources, Resource } from "@/data/resources";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showHiteshOnly, setShowHiteshOnly] = useState(false);

    // State to track expanded sections
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["Year 1", "Year 2", "Year 3", "Year 4"]));

    // Search Logic
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

    // Hierarchical Grouping Logic
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

    // Automatically expand sections if searching
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
            <main className="pt-28 pb-24 min-h-screen bg-[#050810]">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero Header */}
                    <ScrollReveal className="mb-12">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 border border-white/5 p-8 md:p-14 shadow-2xl">
                            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-electric-500/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold tracking-widest uppercase">
                                            <span className="w-2.5 h-2.5 rounded-full bg-electric-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                            Live Repository
                                        </span>
                                        {showHiteshOnly && (
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black tracking-widest uppercase">
                                                Curated Selection
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] text-white tracking-tighter">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 via-white to-violet-400">Notes & More</span>
                                    </h1>
                                    <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-xl">
                                        Explore {stats.total} technical resources including hand-written notes, textbook archives, and core curriculum guides.
                                        {process.env.NODE_ENV === 'development' && (
                                            <span className="block mt-2 text-xs text-electric-400/50">Happy Learning!</span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-5 min-w-[200px]">
                                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 text-center hover:bg-white/10 transition-all duration-300 group shadow-lg">
                                        <div className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">{stats.filtered}</div>
                                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-electric-400 transition-colors">Resources Found</div>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 px-4">
                                        <button
                                            onClick={() => setShowHiteshOnly(!showHiteshOnly)}
                                            className={`group/btn flex items-center gap-2.5 text-[11px] font-black uppercase tracking-tighter transition-all ${showHiteshOnly ? 'text-electric-400' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${showHiteshOnly ? 'bg-electric-500 border-electric-500 ring-8 ring-electric-500/10' : 'border-slate-700 group-hover/btn:border-slate-500'}`}>
                                                {showHiteshOnly && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                                            </div>
                                            Hitesh Notes
                                        </button>
                                        <button
                                            onClick={() => setExpandedSections(new Set())}
                                            className="text-[11px] font-black uppercase tracking-tighter text-slate-600 hover:text-white transition-colors"
                                        >
                                            Collapse All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Search Area */}
                    <div className="max-w-4xl mx-auto mb-20 relative">
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-electric-500/20 to-violet-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                placeholder="Search by subject, code, or topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="relative w-full bg-navy-900/40 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] px-14 py-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all shadow-2xl"
                            />
                            <svg className="absolute left-5 top-[1.65rem] w-7 h-7 text-slate-600 group-focus-within:text-electric-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-5 top-[1.65rem] text-slate-600 hover:text-white transition-colors p-1"
                                >
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Roadmap Tree */}
                    <div className="max-w-4xl mx-auto space-y-8">
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

                        {/* No Results State */}
                        {stats.filtered === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-32 bg-navy-900/20 rounded-[3rem] border-2 border-dashed border-white/5 backdrop-blur-sm"
                            >
                                <div className="text-7xl mb-8 grayscale">🚧</div>
                                <h3 className="text-white text-3xl font-black mb-4 tracking-tight">Empty Roadmap</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-10 text-lg leading-relaxed">
                                    We couldn't find any resources matching "<span className="text-white font-bold">{searchQuery}</span>". Try changing your query.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setShowHiteshOnly(false); }}
                                    className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all border border-white/10 active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                    Refresh Repository
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Request Footer */}
                    <div className="mt-32 max-w-4xl mx-auto text-center p-16 rounded-[3rem] bg-gradient-to-t from-navy-900/50 to-transparent border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-electric-500/50 to-transparent" />
                        <h4 className="text-white text-3xl font-black mb-6 tracking-tighter uppercase font-outfit">Missing something?</h4>
                        <p className="text-slate-400 mb-12 max-w-md mx-auto text-lg leading-relaxed font-medium">
                            The repository grows through community requests. If a note or textbook is missing, please reach out.
                        </p>
                        <a
                            href="mailto:hiteshpranavreddy.d@gmail.com"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-electric-600 hover:bg-electric-500 text-white rounded-[1.5rem] font-black text-base transition-all shadow-2xl shadow-electric-600/20 active:scale-95 group-hover:px-12"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Resource
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
        <motion.div
            layout
            className="bg-navy-900/90 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-shadow duration-500 hover:shadow-electric-500/5"
            style={{ backfaceVisibility: "hidden" }}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-8 md:p-10 hover:bg-white/[0.02] transition-all duration-300 group text-left"
            >
                <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-[1.5rem] transition-all duration-500 ${isExpanded ? 'bg-electric-500 text-white shadow-xl shadow-electric-500/20 -rotate-6 scale-110' : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white'}`}>
                        <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white group-hover:text-electric-400 transition-colors tracking-tighter font-outfit uppercase">{title}</h2>
                        <div className="flex gap-3 mt-1.5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-600">
                            <span>{Object.keys(departments).length} Units</span>
                            <span>•</span>
                            <span>{totalResources} Compiled Files</span>
                        </div>
                    </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/5 ${isExpanded ? 'bg-electric-500/10 rotate-180 border-electric-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <svg className="w-6 h-6 text-slate-500 transition-colors group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="border-t border-white/5 px-8 md:px-14 pb-12 pt-6 space-y-8 bg-navy-950/20"
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
        </motion.div>
    );
}

function DeptSection({ id, title, subjects, isExpanded, onToggle, expandedSections, toggleSection }: any) {
    const totalResources = Object.values(subjects).reduce((acc: number, s: any) => acc + s.length, 0);

    return (
        <div className="pl-8 border-l-2 border-white/5 group/dept">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all duration-400 ${isExpanded ? 'bg-white/[0.03] shadow-inner' : 'hover:bg-white/[0.04]'}`}
            >
                <div className="flex items-center gap-5">
                    <div className={`p-3.5 rounded-2xl transition-all duration-300 ${isExpanded ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'bg-white/5 text-slate-700 group-hover/dept:text-white'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <h3 className="text-2xl font-black text-slate-200 group-hover/dept:text-violet-400 transition-colors tracking-tight uppercase">{title}</h3>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{Object.keys(subjects).length} Subjects • {totalResources} Resources</p>
                    </div>
                </div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-400 ${isExpanded ? 'bg-violet-500/10 rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6 space-y-4 pr-2"
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
        <div className="ml-6 pl-8 border-l border-white/[0.03]">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 will-change-transform ${isExpanded ? 'text-white bg-white/5 border border-white/5' : 'text-slate-600 hover:text-white hover:bg-white/[0.05]'}`}
            >
                <div className="flex items-center gap-4">
                    <svg className={`w-6 h-6 transition-colors ${isExpanded ? 'text-emerald-400' : 'text-slate-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-lg font-black tracking-tight">{title}</span>
                    <span className="text-[11px] bg-white/5 px-3 py-1 rounded-full text-slate-500 font-black border border-white/5">{resources.length}</span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${isExpanded ? 'bg-emerald-500 ring-8 ring-emerald-500/10' : 'bg-transparent'}`} />
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8 grid sm:grid-cols-2 gap-6 pb-8"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 10) * 0.03 }} // Optimized performance for large lists
            className="group"
        // Removed layout prop here - it's too expensive for large collections
        >
            <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col bg-navy-900/90 border border-white/[0.08] rounded-[2rem] p-7 hover:border-electric-500/50 hover:bg-navy-800 transition-all duration-300 h-full shadow-xl relative overflow-hidden group/card active:scale-[0.98] will-change-transform"
                style={{ backfaceVisibility: "hidden" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-electric-500/[0.03] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start justify-between mb-8 relative">
                    <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover/card:scale-110 ${res.type === 'PDF' ? 'bg-red-500/20 text-red-500' :
                        res.type === 'Drive' ? 'bg-yellow-500/20 text-yellow-500' :
                            res.type === 'GitHub' ? 'bg-white/10 text-white' :
                                res.type === 'Website' ? 'bg-blue-500/20 text-blue-500' :
                                    'bg-slate-500/20 text-slate-500'
                        }`}>
                        {res.type === 'PDF' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                        {res.type === 'Drive' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
                        {res.type === 'GitHub' && <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>}
                        {res.type === 'Website' && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                    </div>
                    {res.isHiteshNotes && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-electric-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-electric-500/20 active:scale-110 transition-transform cursor-default select-none">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Hitesh Notes
                        </div>
                    )}
                </div>

                <h4 className="text-white font-black text-xl mb-3 group-hover/card:text-electric-400 transition-colors line-clamp-2 leading-tight tracking-tight uppercase font-outfit">
                    {res.title}
                </h4>

                <div className="mt-auto relative">
                    <p className="text-slate-500 text-[11px] font-black leading-relaxed mb-6 group-hover/card:text-slate-400 transition-colors line-clamp-2 uppercase tracking-widest">{res.tags && res.tags.length > 0 ? res.tags.join(" • ") : res.subject}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
                        <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.25em]">{res.type} Format</span>
                        <div className="flex items-center gap-2 text-electric-400 transition-all transform translate-x-4 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 scale-110">
                            <span className="text-[10px] font-black uppercase tracking-tighter">View</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </a>
        </motion.div>
    );
}
