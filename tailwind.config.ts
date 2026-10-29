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
                ink: {
                    950: "#09090b",
                    900: "#101013",
                    800: "#17171b",
                    700: "#202024",
                },
                paper: "#ececee",
                muted: "#97979f",
                faint: "#5a5a62",
                accent: {
                    400: "#f2b45f",
                    500: "#e8a33d",
                    600: "#c9832a",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["var(--font-jetbrains)", "monospace"],
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};

export default config;
