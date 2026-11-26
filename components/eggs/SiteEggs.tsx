"use client";

/*
 * Site-wide easter eggs, mounted once in the root layout:
 *  - ` opens a drop-down mini shell (also from inside the laptop's terminal)
 *  - ↑↑↓↓←→←→BA toggles a green CRT / oscilloscope theme
 *  - a note in the DevTools console pointing at /found-it/
 *  - counts time on the site today (IST) for the notes-page timer
 */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Shell, { type Line, type ShellProject } from "@/components/shell/Shell";
import { safeStorage, setStorage } from "@/lib/browser";
import { findEgg } from "@/lib/eggs";
import { istDate } from "@/lib/ist";
import { BASE } from "@/lib/site";
import "./eggs.css";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const GREETING: Line[] = [{ kind: "out", node: <span className="sh-dim">mini shell. type help. ` or Esc to close.</span> }];

let greeted = false;

function consoleHello() {
    if (greeted) return;
    greeted = true;
    const big = "font: 600 20px 'Shantell Sans', sans-serif; color: #b14d37;";
    const body = "font: 13px 'Shantell Sans', sans-serif; color: inherit; line-height: 1.6;";
    const link = "font: 13px 'Shantell Sans', sans-serif; color: #e3a34c; text-decoration: underline;";
    console.log("%cOh hi, you opened DevTools.", big);
    console.log(
        "%cThe room is hand-drawn SVG with a little GSAP. No templates, no Three.js.\nSince you're the type who looks under the hood, there's a page that isn't linked from anywhere:",
        body,
    );
    console.log(`%c${location.origin}${BASE}/found-it/`, link);
    console.log("%cAlso: press ` anywhere for a shell.", body);
}

/** Time on the site today, in seconds. Counts only while the tab is visible. */
export function readSiteTime(): number {
    try {
        const v = JSON.parse(safeStorage("local", "sitetime") || "null");
        return v && v.d === istDate() ? v.s : 0;
    } catch {
        return 0;
    }
}

const isTyping = (t: EventTarget | null) => {
    const el = t as HTMLElement | null;
    if (!el) return false;
    if (el.closest?.(".os")) return false; // the laptop's terminal can summon the mini shell
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
};

export default function SiteEggs({ projects }: { projects: ShellProject[] }) {
    const router = useRouter();
    const [shell, setShell] = useState(false);
    const seq = useRef<string[]>([]);

    // Restore CRT mode for this tab.
    useEffect(() => {
        if (safeStorage("session", "crt") === "on") document.documentElement.dataset.crt = "on";
        consoleHello();
    }, []);

    // Keys: backtick and the Konami code.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (isTyping(e.target) && !(e.target as HTMLElement).closest(".mini-shell")) return;
                e.preventDefault();
                setShell((s) => !s);
                findEgg("shell");
                return;
            }
            if (isTyping(e.target)) return;
            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            seq.current = [...seq.current, k].slice(-KONAMI.length);
            if (seq.current.join() === KONAMI.join()) {
                seq.current = [];
                const html = document.documentElement;
                const on = html.dataset.crt !== "on";
                if (on) html.dataset.crt = "on";
                else delete html.dataset.crt;
                setStorage("session", "crt", on ? "on" : "");
                findEgg("konami");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Site time today.
    useEffect(() => {
        const id = setInterval(() => {
            if (document.visibilityState !== "visible") return;
            try {
                localStorage.setItem("sitetime", JSON.stringify({ d: istDate(), s: readSiteTime() + 5 }));
            } catch {}
            window.dispatchEvent(new Event("sitetime"));
        }, 5000);
        return () => clearInterval(id);
    }, []);

    if (!shell) return null;
    return (
        <div
            className="mini-shell"
            role="dialog"
            aria-label="Mini shell"
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    e.stopPropagation();
                    setShell(false);
                }
            }}
        >
            <div className="mini-shell-bar">
                <span>~ mini shell</span>
                <button type="button" onClick={() => setShell(false)} aria-label="Close the mini shell">
                    ` close
                </button>
            </div>
            <Shell
                className="mini-shell-body"
                projects={projects}
                active
                greeting={GREETING}
                onClose={() => setShell(false)}
                onOpen={(t) => {
                    setShell(false);
                    router.push(t);
                }}
            />
        </div>
    );
}
