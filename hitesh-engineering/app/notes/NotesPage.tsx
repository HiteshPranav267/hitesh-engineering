"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import { resources, Resource, Year, Department, ResourceType } from "@/data/resources";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState<Year | 'All'>('All');
    const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
    const [selectedType, setSelectedType] = useState<ResourceType | 'All'>('All');

    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.subject.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesYear = selectedYear === 'All' || res.year === selectedYear;
            const matchesDept = selectedDept === 'All' || res.department === selectedDept;
            const matchesType = selectedType === 'All' || res.type === selectedType;

            return matchesSearch && matchesYear && matchesDept && matchesType;
        });
    }, [searchQuery, selectedYear, selectedDept, selectedType]);

    const stats = useMemo(() => {
        return {
            total: resources.length,
            filtered: filteredResources.length
        };
    }, [filteredResources]);

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero Header */}
                    <ScrollReveal className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/80 to-navy-700/40 border border-white/5 p-8 md:p-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium tracking-wider uppercase mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
                                        Resource Library
                                    </span>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                                        Notes &amp; <span className="bg-gradient-to-r from-electric-400 to-violet-400 bg-clip-text text-transparent">Resources</span>
                                    </h1>
                                    <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                                        Find exactly what you need. Search through {stats.total} engineering resources, notes, and textbook links.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm min-w-[140px] text-center">
                                    <div className="text-2xl font-bold text-white">{stats.filtered}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Results Found</div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-10">
                        {/* Sidebar Filters */}
                        <aside className="space-y-8">
                            <ScrollReveal>
                                <div className="space-y-6">
                                    {/* Search */}
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">Search</h3>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="Search by title or subject..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all"
                                            />
                                            <svg className="absolute right-4 top-3.5 w-4 h-4 text-slate-600 group-focus-within:text-electric-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Department Filter */}
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">Department</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['All', 'S&H', 'ECE', 'CSE', 'Other'].map((dept) => (
                                                <button
                                                    key={dept}
                                                    onClick={() => setSelectedDept(dept as any)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedDept === dept
                                                        ? "bg-electric-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                                                        }`}
                                                >
                                                    {dept}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Year Filter */}
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">Year</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['All', '1', '2', '3', '4'].map((year) => (
                                                <button
                                                    key={year}
                                                    onClick={() => setSelectedYear(year as any)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedYear === year
                                                        ? "bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                                                        }`}
                                                >
                                                    {year === 'All' ? 'All' : `Year ${year}`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Type Filter */}
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">Resource Type</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['All', 'PDF', 'Drive', 'GitHub', 'Website', 'Image'].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedType(type as any)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === type
                                                        ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reset */}
                                    {(searchQuery || selectedDept !== 'All' || selectedYear !== 'All' || selectedType !== 'All') && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSelectedDept('All');
                                                setSelectedYear('All');
                                                setSelectedType('All');
                                            }}
                                            className="text-xs text-electric-400 hover:text-electric-300 transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Reset Filters
                                        </button>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* Need Help Box */}
                            <ScrollReveal delay={0.1}>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-electric-500/10 to-violet-500/10 border border-white/5">
                                    <h4 className="text-white font-semibold text-sm mb-2">Can't find something?</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                        If a link is broken or you need a specific resource that isn't here yet, reach out!
                                    </p>
                                    <a href="mailto:hiteshpranavreddy.d@gmail.com" className="text-xs text-electric-400 font-medium hover:underline">
                                        hiteshpranavreddy.d@gmail.com
                                    </a>
                                </div>
                            </ScrollReveal>
                        </aside>

                        {/* Resource Results */}
                        <div className="space-y-6">
                            {filteredResources.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {filteredResources.slice(0, 50).map((res, i) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2, delay: (i % 10) * 0.05 }}
                                                key={res.id}
                                            >
                                                <a
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => track('resource_click', {
                                                        resource_id: res.id,
                                                        resource_title: res.title,
                                                        resource_type: res.type
                                                    })}
                                                    className="group flex flex-col h-full bg-navy-800/40 border border-white/5 rounded-xl p-5 hover:border-electric-500/20 hover:bg-navy-800/60 transition-all duration-300"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={`p-2 rounded-lg ${res.type === 'PDF' ? 'bg-red-500/10 text-red-400' :
                                                            res.type === 'Drive' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                res.type === 'GitHub' ? 'bg-white/10 text-white' :
                                                                    res.type === 'Website' ? 'bg-blue-500/10 text-blue-400' :
                                                                        'bg-slate-500/10 text-slate-400'
                                                            }`}>
                                                            {res.type === 'PDF' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                                                            {res.type === 'Drive' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
                                                            {res.type === 'GitHub' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>}
                                                            {res.type === 'Website' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                                                            {res.type === 'Image' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                                            {res.type === 'Other' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-500 border border-white/5 uppercase">
                                                                {res.department}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-500 border border-white/5 uppercase">
                                                                Y{res.year}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-white font-medium text-sm mb-1 group-hover:text-electric-400 transition-colors line-clamp-2">
                                                        {res.title}
                                                    </h3>
                                                    <p className="text-slate-500 text-xs mb-4">
                                                        {res.subject} {res.semester ? `• Sem ${res.semester}` : ''}
                                                    </p>

                                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                                        <span className="text-[10px] text-slate-600 font-medium uppercase tracking-tight">
                                                            {res.type} Resource
                                                        </span>
                                                        <span className="text-electric-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </a>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center py-20 px-6 rounded-2xl bg-navy-800/20 border border-dashed border-white/10">
                                    <div className="text-4xl mb-4">🔍</div>
                                    <h3 className="text-white font-medium text-lg mb-2">No resources found</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                        We couldn't find anything matching your current filters. Try adjusting your search or resetting filters.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedDept('All');
                                            setSelectedYear('All');
                                            setSelectedType('All');
                                        }}
                                        className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}

                            {filteredResources.length > 50 && (
                                <div className="text-center py-8 text-slate-600 text-xs">
                                    Showing first 50 results. Use search/filters to narrow down.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
