"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, UserRound, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (success) {
            router.push("/notes");
        }
    }, [success, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        const srn = formData.get("srn")?.toString().trim();
        const password = formData.get("password")?.toString();

        if (!srn || !password) {
            setError("Please provide both SRN/PRN and Password.");
            setIsPending(false);
            return;
        }

        try {
            const supabaseUrl = "https://wvsdsaeyqqaguzhhdezs.supabase.co";
            
            // Hits our secure edge function which bypasses CORS issues!
            const edgeFuncUrl = `${supabaseUrl}/functions/v1/pesu-auth`; 
            
            const res = await fetch(edgeFuncUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2c2RzYWV5cXFhZ3V6aGhkZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDUyODQsImV4cCI6MjA5MDcyMTI4NH0.stfUuaid6fQtG6Q4Dmd8q951lrjCQMQIkGgstk0Ry3A`
                },
                body: JSON.stringify({ srn, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Authentication failed. Incorrect SRN or Password.");
            }

            if (data.success) {
                localStorage.setItem("hitesh_auth", JSON.stringify({ 
                    auth: true, 
                    srn: data.srn, 
                    name: data.name,
                    expires: Date.now() + 86400000 // 24 Hours
                }));
                setSuccess(true);
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "An unexpected error occurred. Please try again later.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#050810] flex items-center justify-center pt-28 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-500/10 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="bg-navy-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 sm:p-12">
                        
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-electric-500/10 border border-electric-500/20 text-electric-400 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight mb-3">Student Access</h1>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
                                Sign in with your SRN/PRN and PESU password to securely access the resource repository.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {(error || success) && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className={`p-4 rounded-2xl text-sm font-bold border ${success ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} flex items-start gap-3`}
                                >
                                    <div className="mt-0.5">
                                        {success ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        )}
                                    </div>
                                    <span className="leading-relaxed">
                                        {success ? "Authentication successful! Redirecting..." : error}
                                    </span>
                                </motion.div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black tracking-[0.1em] text-slate-500 uppercase ml-2">SRN or PRN</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <UserRound className="h-5 w-5 text-slate-500 group-focus-within:text-electric-400 transition-colors" />
                                        </div>
                                        <input
                                            name="srn"
                                            type="text"
                                            required
                                            placeholder="PES120..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all font-medium uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black tracking-[0.1em] text-slate-500 uppercase ml-2">PESU Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-slate-500 group-focus-within:text-electric-400 transition-colors" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending || success}
                                className="w-full bg-electric-600 hover:bg-electric-500 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] active:scale-[0.98] mt-8 overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Authenticate
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-[10px] uppercase font-black tracking-widest text-slate-600 mt-6 flex flex-col gap-1 items-center">
                                <span>Secured by PESU Auth & Supabase Edge</span>
                                <span className="opacity-50">Credentials are never stored</span>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
}
