import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./content/**/*.{md,mdx}",
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