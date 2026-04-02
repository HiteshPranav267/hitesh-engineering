"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import NotesPage from "./NotesPage";

export default function Notes() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const stored = localStorage.getItem("hitesh_auth");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed.auth && parsed.expires > Date.now()) {
                        // Dynamically check against Supabase via the Edge Function
                        const supabaseUrl = "https://wvsdsaeyqqaguzhhdezs.supabase.co";
                        const edgeFuncUrl = `${supabaseUrl}/functions/v1/pesu-auth`;
                        
                        try {
                            const res = await fetch(edgeFuncUrl, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2c2RzYWV5cXFhZ3V6aGhkZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDUyODQsImV4cCI6MjA5MDcyMTI4NH0.stfUuaid6fQtG6Q4Dmd8q951lrjCQMQIkGgstk0Ry3A`
                                },
                                body: JSON.stringify({ action: "check", srn: parsed.srn })
                            });
                            const data = await res.json();
                            
                            if (data.blocked === false) {
                                setIsAuth(true);
                                return; // They are clear to proceed
                            } else {
                                // Instantly invalidate local cache if blocked remotely
                                localStorage.removeItem("hitesh_auth");
                                alert("WARNING: Access revoked safely per administration.");
                            }
                        } catch (err) {
                            console.error("Connectivity issue verifying auth limits.");
                            // If network failure, we still let them read strictly because previously cleared locally, up to administration.
                            setIsAuth(true);
                            return;
                        }
                    }
                } catch (e) {
                    // Invalid JSON
                }
            }
            router.push("/login");
        };

        checkAuth();
    }, [router]);

    if (isAuth === null) {
        return (
            <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-electric-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium tracking-wide">Verifying secure session...</p>
            </div>
        );
    }

    return <NotesPage />;
}
