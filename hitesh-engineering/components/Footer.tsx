import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-10 border-t border-white/8">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-faint text-xs font-mono">
                    © {new Date().getFullYear()} Hitesh Pranav Reddy
                </p>
                <div className="flex items-center gap-6">
                    <Link href="/projects" className="text-faint text-xs hover:text-muted transition-colors">
                        All Projects
                    </Link>
                    <Link href="/notes" className="text-faint text-xs hover:text-muted transition-colors">
                        Notes
                    </Link>
                </div>
            </div>
        </footer>
    );
}
