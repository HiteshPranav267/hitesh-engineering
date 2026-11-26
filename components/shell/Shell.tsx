"use client";

/*
 * A small pretend shell, shared by the laptop's terminal and the backtick mini shell.
 * A few commands print things; anything real opens the matching page.
 */

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { findEgg } from "@/lib/eggs";
import "./shell.css";

export interface ShellProject {
    slug: string;
    title: string;
    group: "rtl" | "ml" | "archive";
}

export type Line = { kind: "cmd"; text: string } | { kind: "out"; node: ReactNode };

// Things in ~ that lead off to a real page.
export const PLACES: { name: string; dir: boolean; target: string }[] = [
    { name: "projects", dir: true, target: "/projects/" },
    { name: "notes", dir: true, target: "/notes/" },
    { name: "library", dir: true, target: "/library/" },
    { name: "experience", dir: true, target: "/experience/" },
    { name: "rtl-docs", dir: true, target: "/rtl-design-docs/" },
    { name: "cv.pdf", dir: false, target: "/cv/" },
    { name: "contact", dir: false, target: "/contact/" },
];

const ABOUT = [
    "ECE at PES University, Bengaluru (2023–27).",
    "RTL design and verification, working towards the full RTL → GDS flow.",
    "Samsung Semiconductor India Research from Jan 2027.",
    "Student Head of the Joy of Engineering Lab (JoEL).",
];

const RESUME: [string, string][] = [
    ["", "DUGGIREDDY HITESH PRANAV REDDY"],
    ["edu", "B.Tech ECE, PES University, Bengaluru · 2023–27"],
    ["2027", "Hardware Student Trainee, Samsung Semiconductor India Research"],
    ["2024–", "Student Head, Joy of Engineering Lab (JoEL), PES"],
    ["2025", "Research Intern, C-ISFCR, PES"],
    ["focus", "RTL design & verification · SystemVerilog · TCL"],
];

const COMMANDS = ["help", "ls", "cd", "open", "cat", "neofetch", "whoami", "pwd", "date", "uname", "echo", "history", "clear", "vivado", "sudo", "exit"];

export function Prompt() {
    return (
        <span className="sh-prompt">
            <span className="sh-user">hitesh@room</span>:<span className="sh-dir">~</span>$
        </span>
    );
}

function Chip() {
    return (
        <svg viewBox="0 0 64 64" className="sh-chip" aria-hidden="true">
            {[14, 24, 34, 44].map((p) => (
                <g key={p} fill="var(--cream)" opacity="0.7">
                    <rect x={p} y="2" width="4" height="10" />
                    <rect x={p} y="52" width="4" height="10" />
                    <rect x="2" y={p} width="10" height="4" />
                    <rect x="52" y={p} width="10" height="4" />
                </g>
            ))}
            <rect x="10" y="10" width="44" height="44" rx="3" fill="var(--black)" stroke="var(--amber)" strokeWidth="2" />
            <circle cx="18" cy="18" r="2.5" fill="var(--amber)" />
            <rect x="20" y="30" width="24" height="3" fill="var(--teal)" />
            <rect x="20" y="37" width="16" height="3" fill="var(--teal)" opacity="0.7" />
        </svg>
    );
}

export function Neofetch() {
    const rows: [string, string][] = [
        ["os", "linux, drawn in svg"],
        ["wm", "i3, more or less"],
        ["shell", "bash · tclsh"],
        ["hdl", "systemverilog"],
        ["eda", "vivado · genus · modus"],
        ["uni", "pes ece, 2023–27"],
        ["next", "samsung ssir · jan 2027"],
    ];
    return (
        <div className="sh-fetch">
            <Chip />
            <div>
                <div className="sh-user">hitesh@room</div>
                <div className="sh-dim">-----------</div>
                {rows.map(([k, v]) => (
                    <div key={k}>
                        <span className="sh-key">{k}</span> {v}
                    </div>
                ))}
                <div className="sh-swatches" aria-hidden="true">
                    {["ink", "teal", "amber", "cream", "brick", "black"].map((c) => (
                        <span key={c} style={{ background: `var(--${c})` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ShellProps {
    projects: ShellProject[];
    active: boolean;
    greeting: Line[];
    onOpen: (target: string) => void;
    onClose: () => void;
    /** Extra commands for this host; return true when handled. */
    intercept?: (cmd: string, arg: string) => boolean;
    /** Extra rows for `help`. */
    helpExtra?: [string, string][];
    className?: string;
}

export default function Shell({ projects, active, greeting, onOpen, onClose, intercept, helpExtra = [], className = "" }: ShellProps) {
    const [lines, setLines] = useState<Line[]>(greeting);
    const [input, setInput] = useState("");
    const [hist, setHist] = useState<string[]>([]);
    const [hi, setHi] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const body = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (active) inputRef.current?.focus({ preventScroll: true });
    }, [active]);

    useEffect(() => {
        body.current?.scrollTo({ top: body.current.scrollHeight });
    }, [lines]);

    const resolve = (raw: string): string | null => {
        const name = raw.replace(/^(\.\/|~\/)/, "").replace(/\/$/, "");
        const place = PLACES.find((p) => p.name === name);
        if (place) return place.target;
        const slug = name.replace(/^projects\//, "");
        if (projects.some((p) => p.slug === slug)) return `/projects/${slug}/`;
        return null;
    };

    const later = (ms: number, fn: () => void) => setTimeout(fn, ms);

    const run = (raw: string) => {
        const text = raw.trim();
        const out: ReactNode[] = [];
        const say = (n: ReactNode) => out.push(n);
        const [cmd = "", ...args] = text.split(/\s+/);
        const arg = args.join(" ");

        if (cmd === "clear") {
            setLines([]);
            return;
        }
        if (!text) {
            setLines((l) => [...l, { kind: "cmd", text: "" }]);
            return;
        }
        if (cmd === "exit" || cmd === "logout" || cmd === "shutdown" || cmd === "poweroff") {
            onClose();
            return;
        }
        if (intercept?.(cmd, arg)) {
            setLines((l) => [...l, { kind: "cmd", text }]);
            return;
        }

        switch (cmd) {
            case "help":
                say(
                    <div className="sh-help">
                        {[
                            ["ls [projects]", "what's here"],
                            ["open <name>", "go there"],
                            ["cat about.txt", "the short version"],
                            ["cat resume", "the slightly longer version"],
                            ["neofetch", "this machine"],
                            ["vivado", "run synthesis"],
                            ["sudo hire hitesh", "you know what to do"],
                            ...helpExtra,
                            ["clear · history · exit", ""],
                        ].map(([c, d]) => (
                            <div key={c}>
                                <span className="sh-key">{c}</span> <span className="sh-dim">{d}</span>
                            </div>
                        ))}
                    </div>,
                );
                break;
            case "ls": {
                const a = arg.replace(/\/$/, "");
                if (!a || a === "~" || a === "." || a === "-la" || a === "-a")
                    say(
                        <div className="sh-ls">
                            {PLACES.map((p) => (
                                <span key={p.name} className={p.dir ? "sh-dir" : undefined}>
                                    {p.name}
                                    {p.dir ? "/" : ""}
                                </span>
                            ))}
                            <span>about.txt</span>
                            <span>resume</span>
                            {a.includes("a") && <span className="sh-dim">.do-not-open</span>}
                        </div>,
                    );
                else if (a === "projects")
                    say(
                        <div className="sh-ls">
                            {projects.map((p) => (
                                <span key={p.slug} className="sh-dir">
                                    {p.slug}/
                                </span>
                            ))}
                        </div>,
                    );
                else if (resolve(a)) say(<span className="sh-dim">{a}: open it to look inside</span>);
                else say(`ls: cannot access '${a}': No such file or directory`);
                break;
            }
            case "cd":
            case "open":
            case "xdg-open": {
                if (cmd === "cd" && (!arg || arg === "~")) break;
                const t = resolve(arg);
                if (!arg) say(`${cmd}: which one? try ls`);
                else if (!t) say(`${cmd}: ${arg}: No such file or directory`);
                else {
                    say(<span className="sh-dim">opening {arg}…</span>);
                    later(380, () => onOpen(t));
                }
                break;
            }
            case "cat":
            case "less":
                if (arg === "about.txt") ABOUT.forEach((l) => say(l));
                else if (arg === "resume" || arg === "resume.pdf" || arg === "cv.pdf")
                    say(
                        <div className="sh-help">
                            {RESUME.map(([k, v]) => (
                                <div key={v}>
                                    <span className="sh-key">{k}</span> {k ? v : <strong>{v}</strong>}
                                </div>
                            ))}
                            <div className="sh-dim">the full one: open cv.pdf</div>
                        </div>,
                    );
                else if (arg === ".do-not-open") say("it says it on the tin.");
                else if (!arg) say("cat: needs a file. try cat resume");
                else if (resolve(arg)) say(`cat: ${arg}: try open ${arg}`);
                else say(`cat: ${arg}: No such file or directory`);
                break;
            case "neofetch":
            case "fastfetch":
                say(<Neofetch />);
                break;
            case "whoami":
                say("hitesh");
                break;
            case "pwd":
                say("/home/hitesh");
                break;
            case "date":
                say(new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" }) + " IST");
                break;
            case "uname":
                say(args.includes("-a") ? "Linux room 6.6.0-lofi #1 SMP x86_64 GNU/Linux" : "Linux");
                break;
            case "echo":
                say(arg);
                break;
            case "history":
                [...hist, text].forEach((h, i) => say(`${String(i + 1).padStart(4)}  ${h}`));
                break;
            case "vivado":
            case "genus":
            case "innovus":
            case "modus":
                findEgg("vivado");
                say(<span className="sh-dim">****** {cmd === "vivado" ? "Vivado v2024.1 (64-bit)" : `Cadence ${cmd}`}</span>);
                say(<span className="sh-dim">starting synthesis for top: riscv_top …</span>);
                say(<span className="sh-err">ERROR: [Common 17-345] A valid license was not found for feature &apos;Synthesis&apos;.</span>);
                say("license not found 😭");
                break;
            case "sudo":
                if (/^hire\s+hitesh\b/i.test(arg)) {
                    findEgg("hire");
                    say(<span className="sh-dim">[sudo] password for recruiter: ********</span>);
                    say(
                        <span>
                            checking … <span className="sh-ok">rtl ✓</span> <span className="sh-ok">verification ✓</span> <span className="sh-ok">tcl ✓</span> <span className="sh-ok">filter coffee ✓</span>
                        </span>,
                    );
                    say(<span className="sh-ok">hitesh added to /etc/hiring. opening contact…</span>);
                    later(1600, () => onOpen("/contact/"));
                } else if (!arg) say("usage: sudo <command>");
                else say("hitesh is not in the sudoers file. This incident will be reported.");
                break;
            case "su":
                say("su: Authentication failure");
                break;
            case "rm":
            case "mv":
            case "touch":
            case "mkdir":
                say(`${cmd}: read-only file system (it's a drawing)`);
                break;
            case "vim":
            case "nvim":
            case "vi":
            case "nano":
            case "emacs":
            case "code":
                say(`${cmd}: no editors on this one. try open projects`);
                break;
            default:
                say(`${cmd}: command not found. try help`);
        }
        setLines((l) => [...l, { kind: "cmd", text }, ...out.map((node) => ({ kind: "out" as const, node }))]);
    };

    const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            run(input);
            if (input.trim()) setHist((h) => [...h, input.trim()]);
            setInput("");
            setHi(-1);
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            if (!hist.length) return;
            const next = e.key === "ArrowUp" ? (hi === -1 ? hist.length - 1 : Math.max(0, hi - 1)) : hi === -1 ? -1 : hi + 1;
            if (next >= hist.length || next === -1) {
                setHi(-1);
                setInput("");
            } else {
                setHi(next);
                setInput(hist[next]);
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            const parts = input.split(" ");
            const last = parts.at(-1) ?? "";
            const pool = parts.length === 1 ? COMMANDS : [...PLACES.map((p) => p.name), "about.txt", "resume", ...projects.map((p) => p.slug)];
            const hits = pool.filter((w) => w.startsWith(last));
            if (hits.length === 1) setInput([...parts.slice(0, -1), hits[0]].join(" ") + " ");
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    return (
        <div className={`sh ${className}`} ref={body} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
            {lines.map((l, i) =>
                l.kind === "cmd" ? (
                    <div key={i}>
                        <Prompt /> {l.text}
                    </div>
                ) : (
                    <div key={i}>{l.node}</div>
                ),
            )}
            <div className="sh-line">
                <Prompt />
                <input
                    ref={inputRef}
                    className="sh-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    aria-label="Terminal. Type help for commands."
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
