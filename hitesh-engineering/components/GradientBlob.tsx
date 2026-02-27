"use client";

export default function GradientBlob() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-electric-500/20 rounded-full blur-[128px] animate-blob" />
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-500/15 rounded-full blur-[128px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-electric-600/10 rounded-full blur-[128px] animate-blob animation-delay-4000" />
        </div>
    );
}