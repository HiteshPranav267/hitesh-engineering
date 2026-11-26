"use client";

/*
 * The laptop's desktop: a small i3-style Linux session drawn over the laptop screen
 * once the camera has zoomed in. Three workspaces (terminal, files, waves), a few
 * commands, nothing else. It's a toy: anything real opens the matching page.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Shell, { Neofetch, PLACES, type Line, type ShellProject } from "@/components/shell/Shell";
import { Trace, type Waveform } from "./art";
import "./laptop-os.css";

export type OsProject = ShellProject;

export interface ScreenRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface Props {
    rect: ScreenRect;
    projects: OsProject[];
    wave: Waveform;
    onOpen: (target: string) => void;
    onClose: () => void;
}

type Ws = 1 | 2 | 3;
const WORKSPACES: { n: Ws; name: string }[] = [
    { n: 1, name: "term" },
    { n: 2, name: "files" },
    { n: 3, name: "waves" },
];

const NATIVE = [316, 212]; // the drawn screen, used for the aspect ratio

const GREETING: Line[] = [
    { kind: "cmd", text: "neofetch" },
    { kind: "out", node: <Neofetch /> },
    { kind: "out", node: <span className="sh-dim">type help, or use the workspaces up top.</span> },
];

function useClock() {
    const fmt = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const [t, setT] = useState(fmt);
    useEffect(() => {
        const id = setInterval(() => setT(fmt()), 10_000);
        return () => clearInterval(id);
    }, []);
    return t;
}

/* ---------------- file manager ---------------- */

function Folder({ cls }: { cls: string }) {
    return (
        <svg viewBox="0 0 40 30" className="os-folder" aria-hidden="true">
            <path d="M0 4 a2 2 0 0 1 2 -2 h12 l4 4 h20 a2 2 0 0 1 2 2 v20 a2 2 0 0 1 -2 2 h-36 a2 2 0 0 1 -2 -2 z" className={cls} />
            <rect x="0" y="10" width="40" height="3" className="f-black" opacity="0.15" />
        </svg>
    );
}

function Files({ projects, onOpen }: { projects: OsProject[]; onOpen: (t: string) => void }) {
    const groups: { key: OsProject["group"]; name: string; cls: string }[] = [
        { key: "rtl", name: "rtl", cls: "f-amber" },
        { key: "ml", name: "ml", cls: "f-teal" },
    ];
    return (
        <div className="os-files">
            <nav className="os-places" aria-label="Places">
                <div className="os-dim os-small">places</div>
                {PLACES.map((p) => (
                    <button key={p.name} type="button" onClick={() => onOpen(p.target)}>
                        {p.name}
                    </button>
                ))}
            </nav>
            <div className="os-grid-wrap">
                <div className="os-path">~/projects</div>
                {groups.map((g) => (
                    <section key={g.key} aria-label={`${g.name} projects`}>
                        <div className="os-dim os-small">{g.name}/</div>
                        <div className="os-grid">
                            {projects
                                .filter((p) => p.group === g.key)
                                .map((p) => (
                                    <button key={p.slug} type="button" className="os-item" title={p.title} aria-label={`${p.title} — open the project`} onClick={() => onOpen(`/projects/${p.slug}/`)}>
                                        <Folder cls={g.cls} />
                                        <span>{p.slug}</span>
                                    </button>
                                ))}
                        </div>
                    </section>
                ))}
                <button type="button" className="os-more" onClick={() => onOpen("/projects/")}>
                    everything, with write-ups →
                </button>
            </div>
        </div>
    );
}

/* ---------------- waveform viewer ---------------- */

function valueAt(sig: Waveform["signals"][number], t: number) {
    let v = sig.changes[0]?.[1] ?? "x";
    for (const [ct, cv] of sig.changes) {
        if (ct > t) break;
        v = cv;
    }
    return v;
}

function Waves({ wave }: { wave: Waveform }) {
    const [t, setT] = useState(wave.end * 0.42);
    const W = 600;
    const rowH = 26;
    const rows = wave.signals;
    const H = rows.length * rowH;
    const ns = (v: number) => `${(v / 1000).toFixed(1)} ns`;
    const move = (clientX: number, el: Element) => {
        const r = el.getBoundingClientRect();
        setT(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * wave.end);
    };
    return (
        <div className="os-waves">
            <div className="os-wtool">
                <span>riscv.vcd</span>
                <span className="os-dim">tb_riscv_top · 1 ps timescale</span>
                <span className="os-key">cursor {ns(t)}</span>
            </div>
            <div className="os-wbody">
                <div className="os-wnames" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
                    {rows.map((s) => (
                        <div key={s.name}>
                            <span>{s.name}</span>
                            <span className="os-key">{s.width === 1 ? valueAt(s, t) : `h${valueAt(s, t)}`}</span>
                        </div>
                    ))}
                </div>
                <svg
                    className="os-wsvg"
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="none"
                    onPointerMove={(e) => move(e.clientX, e.currentTarget)}
                    onPointerDown={(e) => move(e.clientX, e.currentTarget)}
                    role="img"
                    aria-label="Waveform of the RISC-V testbench. Move the pointer to read values."
                >
                    {rows.map((s, i) => (
                        <Trace key={s.name} sig={s} end={wave.end} w={W} y={i * rowH + 6} h={14} />
                    ))}
                    <line x1={(t / wave.end) * W} x2={(t / wave.end) * W} y1="0" y2={H} className="os-cursor" />
                </svg>
            </div>
        </div>
    );
}

/* ---------------- the session ---------------- */

export default function LaptopOS({ rect, projects, wave, onOpen, onClose }: Props) {
    const [ws, setWs] = useState<Ws>(1);
    const clock = useClock();
    const root = useRef<HTMLDivElement>(null);

    // Draw at a comfortable "native" resolution, then scale it onto the drawn screen.
    const nw = Math.min(820, Math.max(400, rect.width));
    const nh = (nw * NATIVE[1]) / NATIVE[0];
    const k = rect.width / nw;

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") onClose();
        else if (e.altKey && ["1", "2", "3"].includes(e.key)) {
            e.preventDefault();
            setWs(Number(e.key) as Ws);
        }
    };

    useEffect(() => {
        if (ws !== 1) root.current?.querySelector<HTMLElement>(".os-ws-btn[aria-pressed='true']")?.focus({ preventScroll: true });
    }, [ws]);

    return (
        <div ref={root} className="os" role="dialog" aria-modal="true" aria-label="Hitesh's laptop" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} onKeyDown={onKey}>
            <div className="os-screen" style={{ width: nw, height: nh, transform: `scale(${k})` }}>
                <header className="os-bar">
                    <div className="os-wss">
                        {WORKSPACES.map((w) => (
                            <button key={w.n} type="button" className="os-ws-btn" aria-pressed={ws === w.n} onClick={() => setWs(w.n)}>
                                {w.n}:{w.name}
                            </button>
                        ))}
                    </div>
                    <div className="os-status">
                        <span className="os-dim">wlan pes</span>
                        <span className="os-dim">bat 82%</span>
                        <span>{clock}</span>
                        <button type="button" className="os-power" onClick={onClose} aria-label="Close the laptop (Esc)" title="Close the laptop (Esc)">
                            ⏻
                        </button>
                    </div>
                </header>
                <div className="os-desk">
                    <div className="os-win" hidden={ws !== 1}>
                        <div className="os-title">terminal — bash</div>
                        <Shell
                            className="os-term"
                            projects={projects}
                            active={ws === 1}
                            greeting={GREETING}
                            onOpen={onOpen}
                            onClose={onClose}
                            helpExtra={[
                                ["cd projects", "the file manager"],
                                ["gtkwave", "the RISC-V waveform"],
                            ]}
                            intercept={(cmd, arg) => {
                                if ((cmd === "cd" && arg.replace(/\/$/, "") === "projects") || ["files", "nautilus", "thunar", "ranger"].includes(cmd)) setWs(2);
                                else if (cmd === "gtkwave" || cmd === "waves") setWs(3);
                                else return false;
                                return true;
                            }}
                        />
                    </div>
                    <div className="os-win" hidden={ws !== 2}>
                        <div className="os-title">files — ~/projects</div>
                        <Files projects={projects} onOpen={onOpen} />
                    </div>
                    <div className="os-win" hidden={ws !== 3}>
                        <div className="os-title">gtkwave — riscv.vcd</div>
                        <Waves wave={wave} />
                    </div>
                </div>
            </div>
        </div>
    );
}
