import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getProfile } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500"] });
const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap", weight: ["400", "600"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400"] });

const profile = getProfile();

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL + "/"),
    title: { default: profile.short_name, template: `%s — ${profile.short_name}` },
    description: profile.status,
    authors: [{ name: profile.name }],
    openGraph: { title: profile.short_name, description: profile.status, url: SITE_URL, type: "website" },
    verification: { google: "jLd95OrsDzo_uik_gs_23P9WohEKStyvcoRGeDjLIG4" },
    icons: { icon: "/hitesh-engineering/favicon.png?v=2" },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
        { media: "(prefers-color-scheme: dark)", color: "#141922" },
    ],
};

// Runs before paint so the stored or system theme never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="day"&&t!=="night"){t="day"}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <a className="skip" href="#main">
                    Skip to content
                </a>
                <SiteHeader name={profile.short_name} />
                {children}
                <SiteFooter profile={profile} />
            </body>
        </html>
    );
}
