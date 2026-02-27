export default function Footer() {
    return (
        <footer className="py-8 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} ❤️ Hitesh Pranav Reddy
                </p>
            </div>
        </footer>
    );
}