# Bootstrap a premium Next.js (App Router) + TS + Tailwind + Framer Motion + MDX-ready portfolio
# Windows PowerShell script
# Usage:
#   Set-ExecutionPolicy -Scope Process Bypass
#   .\bootstrap.ps1
#
# Requirements: Node.js (npm), Git

$ErrorActionPreference = "Stop"

$APP_NAME = "hitesh-engineering"

Write-Host "==> Creating Next.js app: $APP_NAME"

# 1) Create Next.js app (App Router + TS + Tailwind)
npx create-next-app@latest $APP_NAME `
    --ts `
    --tailwind `
    --eslint `
    --app `
    --src-dir false `
    --import-alias "@/*" `
    --use-npm

Set-Location $APP_NAME

# 2) Install dependencies
Write-Host "==> Installing dependencies"
npm install framer-motion gray-matter next-mdx-remote @tailwindcss/typography

# 3) Create folders
Write-Host "==> Creating folders"
New-Item -ItemType Directory -Force -Path components, data, lib, content\notes, public\projects, app\projects\[slug], app\notes | Out-Null

# Helper: write UTF-8 files without BOM (best for Next.js)
function Write-TextFile {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )
    $dir = Split-Path -Parent $Path
    if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

# 4) Write files
Write-Host "==> Writing files"

Write-TextFile -Path "next.config.mjs" -Content @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};
export default nextConfig;
"@

Write-TextFile -Path "tailwind.config.ts" -Content @"
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0B0F1A",
          800: "#0F1629",
          700: "#131B36",
          600: "#1A2342",
        },
        electric: {
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        violet: {
          400: "#A78BFA",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
"@

Write-TextFile -Path "app\globals.css" -Content @"
@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }

body {
  background-color: #0b0f1a;
  color: #e2e8f0;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0b0f1a; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #334155; }

/* Animation delays */
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

/* Selection */
::selection { background-color: rgba(59, 130, 246, 0.3); color: #fff; }
"@

Write-TextFile -Path "app\layout.tsx" -Content @"
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Hitesh Pranav Reddy | Portfolio",
  description:
    "Electronics & Communication Engineer specializing in VLSI, Hardware Security, and Machine Learning. Portfolio showcasing projects, research, and technical expertise.",
  openGraph: {
    title: "Hitesh Pranav Reddy | Portfolio",
    description: "Electronics & Communication Engineer | VLSI & Hardware Security | ML & Security",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-navy-900 text-slate-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
"@

Write-TextFile -Path "app\page.tsx" -Content @"
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Resume />
      <Contact />
      <Footer />
    </main>
  );
}
"@

Write-TextFile -Path "data\projects.ts" -Content @"
export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  details: string;
  image: string;
}

export const projects: Project[] = [
  {
    slug: "automotive-ml-ids",
    title: "Automotive ML-based IDS",
    description: "Machine learning-powered intrusion detection system for automotive CAN bus networks.",
    tags: ["Python", "Machine Learning", "Automotive Security", "CAN Bus"],
    details:
      "Developed an intelligent intrusion detection system leveraging machine learning algorithms to monitor and detect anomalous behavior in automotive CAN bus communications.",
    image: "/projects/automotive-ids.jpg",
  },
  {
    slug: "realtime-telemetry-dashboard",
    title: "Real-time Telemetry Dashboard",
    description: "Live telemetry visualization dashboard for embedded sensor data streams.",
    tags: ["React", "WebSocket", "D3.js", "IoT", "TypeScript"],
    details:
      "Built a real-time telemetry dashboard capable of ingesting, processing, and visualizing high-frequency sensor data streams from embedded devices.",
    image: "/projects/telemetry-dashboard.jpg",
  },
  {
    slug: "embedded-systems-prototypes",
    title: "Embedded Systems Prototypes",
    description: "Collection of embedded systems projects exploring hardware-software co-design.",
    tags: ["C", "FPGA", "Verilog", "ARM", "Embedded Systems"],
    details:
      "A portfolio of embedded systems prototypes spanning FPGA-based digital design, ARM microcontroller programming, and hardware-software co-design experiments.",
    image: "/projects/embedded-prototypes.jpg",
  },
];
"@

Write-TextFile -Path "data\social.ts" -Content @"
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/hitesh-pranav-reddy-379371264/", icon: "linkedin", label: "Connect on LinkedIn" },
  { name: "GitHub", url: "https://github.com/HiteshPranav267", icon: "github", label: "View GitHub Profile" },
  { name: "Instagram", url: "https://instagram.com/hitesh_26_7", icon: "instagram", label: "Follow on Instagram" },
  { name: "Email", url: "mailto:hiteshpranavreddy.d@gmail.com", icon: "email", label: "Send an Email" }
];
"@

Write-TextFile -Path "components\Footer.tsx" -Content @"
export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Hitesh Pranav Reddy. Built with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
"@

Write-Host ""
Write-Host "✅ Bootstrapped $APP_NAME (Windows)."
Write-Host "Next steps:"
Write-Host "  cd $APP_NAME"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "NOTE: This script writes the core files. If you want, I can extend it to also generate:"
Write-Host "  Navbar, Hero, About, Projects grid + dynamic /projects/[slug], Resume PDF embed,"
Write-Host "  Contact icons, /notes route + MDX content + sidebar."