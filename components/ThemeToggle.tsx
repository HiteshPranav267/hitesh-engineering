"use client";

import { setStorage, useBrowserValue } from "@/lib/browser";

export type Theme = "day" | "night";

export function setTheme(t: Theme) {
    document.documentElement.dataset.theme = t;
    setStorage("local", "theme", t);
    window.dispatchEvent(new Event("themechange"));
}

export const useTheme = (): Theme =>
    useBrowserValue(["themechange", "storagechange"], () => (document.documentElement.dataset.theme as Theme) || "day", "day");

export default function ThemeToggle() {
    const theme = useTheme();
    return (
        <button type="button" className="text-button" onClick={() => setTheme(theme === "night" ? "day" : "night")}>
            {theme === "night" ? "Light" : "Dark"}
        </button>
    );
}
