/*
 * Room art: flat geometric SVG, six palette colours per theme (see app/globals.css),
 * tonal shading by flat translucent blocks. Every object draws in its own local
 * coordinates matching its scene.json `box`; the Room component places it.
 *
 * Text that should eventually be Hitesh's handwriting (sticky notes, notebook spines,
 * the field-notes title) uses the .hand placeholder font and carries
 * data-replace="[[REPLACE WITH HANDWRITING PHOTO]]".
 */

import type { ExperienceEntry, NoteSubject } from "@/lib/content";

const REPLACE = "[[REPLACE WITH HANDWRITING PHOTO]]";

/* ---------------- laptop ---------------- */

export interface Waveform {
    end: number;
    signals: { name: string; width: number; changes: [number, string][] }[];
}

function Trace({ sig, end, w, y, h }: { sig: Waveform["signals"][number]; end: number; w: number; y: number; h: number }) {
    const xs = (t: number) => (t / end) * w;
    if (sig.width === 1) {
        let d = "";
        sig.changes.forEach(([t, v], i) => {
            const yy = v === "1" ? y : y + h;
            d += i === 0 ? `M0 ${yy}` : ` H${xs(t)} V${yy}`;
        });
        d += ` H${w}`;
        return <path d={d} className="wave-line" />;
    }
    return (
        <g>
            {sig.changes.map(([t, v], i) => {
                const x0 = xs(t);
                const x1 = xs(sig.changes[i + 1]?.[0] ?? end);
                const k = Math.min(3, (x1 - x0) / 3);
                return (
                    <g key={t}>
                        <path d={`M${x0} ${y + h / 2} L${x0 + k} ${y} H${x1 - k} L${x1} ${y + h / 2} L${x1 - k} ${y + h} H${x0 + k} Z`} className="wave-bus" />
                        {x1 - x0 > 16 && (
                            <text x={x0 + k + 2} y={y + h - 2.5} className="wave-text">
                                {v}
                            </text>
                        )}
                    </g>
                );
            })}
        </g>
    );
}

export function Laptop({ wave, uid }: { wave: Waveform; uid: string }) {
    const W = 300; // one waveform period drawn twice for a seamless scroll
    const rows = wave.signals.filter((s) => s.name !== "instruction");
    const rowH = 22;
    return (
        <g>
            {/* screen lid */}
            <rect x="38" y="0" width="344" height="246" rx="10" className="f-black" />
            <rect x="52" y="14" width="316" height="212" rx="3" className="f-ink" />
            <clipPath id={`screen-clip-${uid}`}>
                <rect x="52" y="14" width="316" height="212" rx="3" />
            </clipPath>
            <g clipPath={`url(#screen-clip-${uid})`}>
                <rect x="52" y="14" width="316" height="20" className="f-black" opacity="0.35" />
                <text x="60" y="28" className="screen-text">
                    tb_riscv_top · riscv.vcd
                </text>
                <g transform="translate(60 44)">
                    {rows.map((s, i) => (
                        <text key={s.name} x="0" y={i * rowH + 13} className="screen-text dim">
                            {s.name}
                        </text>
                    ))}
                </g>
                <g transform="translate(130 44)">
                    <g className="wave-scroll">
                        {[0, W].map((dx) => (
                            <g key={dx} transform={`translate(${dx} 0)`}>
                                {rows.map((s, i) => (
                                    <Trace key={s.name} sig={s} end={wave.end} w={W} y={i * rowH + 2} h={14} />
                                ))}
                            </g>
                        ))}
                    </g>
                </g>
                <text x="60" y="214" className="screen-text">
                    RESULT: PASS=10 FAIL=0
                </text>
                <rect x="186" y="205" width="7" height="11" className="f-amber cursor-blink" />
            </g>
            {/* hinge and base */}
            <rect x="30" y="246" width="360" height="8" className="f-black" />
            <polygon points="0,254 420,254 404,292 16,292" className="f-black" />
            <polygon points="0,254 420,254 416,262 4,262" className="f-cream" opacity="0.12" />
            <rect x="170" y="268" width="80" height="14" rx="3" className="f-cream" opacity="0.08" />
            <rect x="0" y="292" width="420" height="8" className="f-black" opacity="0.35" />
        </g>
    );
}

/* ---------------- open notebook ---------------- */

export function FieldNotes() {
    return (
        <g>
            <polygon points="8,26 150,12 150,124 0,118" className="f-cream" />
            <polygon points="150,12 292,26 300,118 150,124" className="f-cream" />
            <polygon points="150,12 162,14 162,124 150,124" className="f-black" opacity="0.12" />
            <polygon points="0,118 150,124 300,118 300,128 150,130 0,128" className="f-black" opacity="0.25" />
            {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="18" y1={58 + i * 12} x2="138" y2={52 + i * 12 + 2} className="s-rule" />
            ))}
            <text x="22" y="44" className="hand" data-replace={REPLACE} transform="rotate(-4 22 44)">
                RTL Field Notes
            </text>
            {/* a small FSM sketch on the right page */}
            <g className="s-ink-line" fill="none">
                <circle cx="190" cy="50" r="12" />
                <circle cx="252" cy="50" r="12" />
                <circle cx="221" cy="96" r="12" />
                <path d="M203 46 Q221 36 239 46" />
                <path d="M248 62 L230 86" />
                <path d="M211 88 L196 62" />
            </g>
        </g>
    );
}

/* ---------------- shelf ---------------- */

export interface SpineGeom {
    slug: string;
    subject: string;
    pages: number;
    department: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export const SHELF_ROWS = [130, 275, 420]; // plank tops for year 1, 2, 3

export function shelfLayout(subjects: NoteSubject[]): SpineGeom[] {
    const out: SpineGeom[] = [];
    [1, 2, 3].forEach((year, r) => {
        let x = 22;
        subjects
            .filter((s) => s.year === year)
            .forEach((s, i) => {
                const w = Math.round(Math.min(38, Math.max(13, 9 + s.pages / 6.5)));
                const h = 92 + ((i * 37 + s.pages) % 26);
                out.push({ slug: s.slug, subject: s.subject, pages: s.pages, department: s.department, x, y: SHELF_ROWS[r] - h, w, h });
                x += w + 3;
            });
    });
    return out;
}

const DEPT_CLASS: Record<string, string> = { ECE: "f-teal", CSE: "f-amber", "S&H": "f-brick" };

export function Shelf({ spines }: { spines: SpineGeom[] }) {
    return (
        <g>
            {SHELF_ROWS.map((y) => (
                <g key={y}>
                    <rect x="0" y={y} width="560" height="10" className="f-black" />
                    <rect x="0" y={y + 10} width="560" height="4" className="f-black" opacity="0.3" />
                    <polygon points={`30,${y + 10} 44,${y + 10} 30,${y + 30}`} className="f-black" />
                    <polygon points={`530,${y + 10} 516,${y + 10} 530,${y + 30}`} className="f-black" />
                </g>
            ))}
            {spines.map((s) => (
                <g key={s.slug} id={`spine-${s.slug}`} className="spine">
                    <rect x={s.x} y={s.y} width={s.w} height={s.h} className={DEPT_CLASS[s.department] ?? "f-cream"} />
                    <rect x={s.x + s.w - 4} y={s.y} width="4" height={s.h} className="f-black" opacity="0.18" />
                    <rect x={s.x} y={s.y + 10} width={s.w} height="5" className="f-black" opacity="0.2" />
                    <text
                        className="spine-label"
                        data-replace={REPLACE}
                        transform={`translate(${s.x + s.w / 2 + 4} ${s.y + s.h - 10}) rotate(-90)`}
                        fontSize={Math.min(13, s.w * 0.62)}
                    >
                        {s.subject.length > 14 ? s.subject.slice(0, 13) + "…" : s.subject}
                    </text>
                </g>
            ))}
        </g>
    );
}

export function Plane() {
    return (
        <g id="plane-body">
            <polygon points="10,26 96,20 114,24 96,30 10,30" className="f-cream" />
            <polygon points="44,24 70,2 80,2 64,26" className="f-brick" />
            <polygon points="48,28 74,46 84,46 66,28" className="f-brick" opacity="0.8" />
            <polygon points="10,26 4,8 14,8 22,24" className="f-brick" />
            <rect x="98" y="22" width="8" height="3" className="f-ink" />
            <rect x="40" y="44" width="40" height="6" className="f-black" opacity="0.5" />
            <rect x="56" y="30" width="4" height="14" className="f-black" opacity="0.5" />
        </g>
    );
}

/* ---------------- wall items ---------------- */

const MONTH_INITIALS = "JFMAMJJASOND".split("");

function monthIndex(ym: string | null, now: string): number | null {
    const v = ym === "present" ? now : ym;
    if (!v) return null;
    const [y, m] = v.split("-").map(Number);
    return y * 12 + (m - 1);
}

export function Calendar({ entries, now }: { entries: ExperienceEntry[]; now: string }) {
    const years = [2024, 2025, 2026, 2027];
    const cell = 16;
    const gx = 44;
    const gy = 78;
    const fills: Record<string, string> = { joel: "f-teal", "c-isfcr": "f-brick", samsung: "f-amber" };
    const marked = entries.filter((e) => e.calendar !== "none");
    return (
        <g>
            <rect x="121" y="0" width="8" height="12" className="f-black" />
            <rect x="0" y="12" width="250" height="318" className="f-cream" />
            <rect x="0" y="12" width="250" height="44" className="f-brick" />
            {[30, 70, 110, 150, 190, 220].map((x) => (
                <rect key={x} x={x} y="8" width="4" height="12" className="f-black" />
            ))}
            <text x="16" y="42" className="cal-head">
                2024 — 2027
            </text>
            {MONTH_INITIALS.map((m, i) => (
                <text key={i} x={gx + i * (cell + 1) + 4} y={gy - 6} className="cal-small">
                    {m}
                </text>
            ))}
            {years.map((y, r) => (
                <g key={y}>
                    <text x="10" y={gy + r * (cell + 8) + 12} className="cal-small">
                        {y}
                    </text>
                    {MONTH_INITIALS.map((_, c) => {
                        const idx = y * 12 + c;
                        const hit = marked.find((e) => {
                            const a = monthIndex(e.start, now);
                            const b = monthIndex(e.end, now);
                            return a !== null && b !== null && idx >= a && idx <= b;
                        });
                        return (
                            <rect
                                key={c}
                                x={gx + c * (cell + 1)}
                                y={gy + r * (cell + 8)}
                                width={cell}
                                height={cell}
                                className={hit ? fills[hit.id] ?? "f-ink" : "f-black"}
                                opacity={hit ? 0.9 : 0.08}
                            />
                        );
                    })}
                </g>
            ))}
            {/* January 2027 circled */}
            <ellipse cx={gx + cell / 2} cy={gy + 3 * (cell + 8) + cell / 2} rx="15" ry="13" className="s-brick-ring" />
            <g transform="translate(14 200)">
                {marked.map((e, i) => (
                    <g key={e.id} transform={`translate(0 ${i * 22})`}>
                        <rect width="12" height="12" className={fills[e.id] ?? "f-ink"} />
                        <text x="20" y="11" className="cal-small">
                            {e.org.split(",")[0].replace("Joy of Engineering Lab (JoEL)", "JoEL")}
                        </text>
                    </g>
                ))}
            </g>
            <rect x="0" y="318" width="250" height="12" className="f-black" opacity="0.08" />
        </g>
    );
}

export function Stickies({ lines }: { lines: string[][] }) {
    const notes = [
        { x: 0, y: 14, r: -5, cls: "f-amber" },
        { x: 84, y: 0, r: 3, cls: "f-cream" },
        { x: 166, y: 18, r: -2, cls: "f-teal" },
    ];
    return (
        <g>
            {notes.map((n, i) => (
                <g key={i} transform={`rotate(${n.r} ${n.x + 36} ${n.y + 36})`}>
                    <rect x={n.x + 3} y={n.y + 4} width="72" height="72" className="f-black" opacity="0.18" />
                    <rect x={n.x} y={n.y} width="72" height="72" className={n.cls} />
                    <rect x={n.x} y={n.y} width="72" height="12" className="f-black" opacity="0.07" />
                    {(lines[i] ?? []).map((l, j) => (
                        <text key={j} x={n.x + 7} y={n.y + 30 + j * 15} className="hand-small" data-replace={REPLACE}>
                            {l}
                        </text>
                    ))}
                </g>
            ))}
        </g>
    );
}

export function Lanyards({ cards }: { cards: { title: string; sub: string; cls: string }[] }) {
    return (
        <g>
            <rect x="58" y="0" width="34" height="10" className="f-black" />
            <rect x="71" y="10" width="8" height="14" className="f-black" />
            {cards.map((c, i) => {
                const cx = i === 0 ? 4 : 82;
                const top = i === 0 ? 150 : 170;
                return (
                    <g key={c.title}>
                        <polygon points={`72,22 78,22 ${cx + 40},${top} ${cx + 30},${top}`} className={c.cls} />
                        <polygon points={`72,22 78,22 ${cx + 30},${top} ${cx + 22},${top}`} className={c.cls} opacity="0.7" />
                        <rect x={cx + 26} y={top - 4} width="18" height="10" className="f-black" />
                        <rect x={cx + 3} y={top + 7} width="64" height="88" className="f-black" opacity="0.18" />
                        <rect x={cx} y={top + 4} width="64" height="88" className="f-cream" />
                        <rect x={cx} y={top + 4} width="64" height="18" className={c.cls} />
                        <rect x={cx + 8} y={top + 30} width="22" height="26" className="f-ink" opacity="0.25" />
                        <text x={cx + 6} y={top + 70} className="card-title">
                            {c.title}
                        </text>
                        <text x={cx + 6} y={top + 82} className="card-sub">
                            {c.sub}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

export function Window({ sky, uid }: { sky: "day" | "sunset" | "night"; uid: string }) {
    return (
        <g>
            <defs>
                <linearGradient id={`sky-day-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#8fb7cc" />
                    <stop offset="1" stopColor="#cfe0e4" />
                </linearGradient>
                <linearGradient id={`sky-sunset-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5b5a86" />
                    <stop offset="1" stopColor="#e39a62" />
                </linearGradient>
                <linearGradient id={`sky-night-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#0c1322" />
                    <stop offset="1" stopColor="#1e2b46" />
                </linearGradient>
                <clipPath id={`sky-clip-${uid}`}>
                    <rect x="22" y="22" width="336" height="356" />
                </clipPath>
            </defs>
            <rect x="0" y="0" width="380" height="400" className="f-cream" />
            <rect x="22" y="22" width="336" height="356" fill={`url(#sky-${sky}-${uid})`} />
            <g clipPath={`url(#sky-clip-${uid})`}>
                {sky === "night" && (
                    <g className="f-cream">
                        <circle cx="282" cy="86" r="22" />
                        {[
                            [60, 60], [120, 110], [200, 50], [90, 170], [320, 160], [240, 140], [160, 200],
                        ].map(([x, y]) => (
                            <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" />
                        ))}
                    </g>
                )}
                {sky !== "night" && <circle cx="280" cy={sky === "day" ? 90 : 290} r="26" className="f-cream" opacity="0.85" />}
                {/* distant rooftops */}
                <polygon points="22,378 22,300 70,300 70,276 112,276 112,318 168,318 168,262 196,248 224,262 224,330 280,330 280,292 330,292 330,250 358,250 358,378" className="f-black" opacity={sky === "night" ? 0.6 : 0.28} />
                {sky === "night" &&
                    [
                        [84, 290], [128, 300], [176, 282], [292, 306], [340, 270], [208, 300],
                    ].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="6" height="8" className="f-amber" opacity="0.8" />)}
                <g className="rain" clipPath={`url(#sky-clip-${uid})`}>
                    {Array.from({ length: 28 }, (_, i) => (
                        <line key={i} x1={30 + ((i * 53) % 330)} y1={-40 + ((i * 97) % 300)} x2={24 + ((i * 53) % 330)} y2={-14 + ((i * 97) % 300)} className="s-rain" />
                    ))}
                </g>
            </g>
            <rect x="182" y="22" width="16" height="356" className="f-cream" />
            <rect x="22" y="192" width="336" height="14" className="f-cream" />
            <rect x="0" y="0" width="380" height="400" fill="none" className="s-frame" />
            <rect x="-14" y="400" width="408" height="20" className="f-cream" />
            <rect x="-14" y="420" width="408" height="6" className="f-black" opacity="0.2" />
        </g>
    );
}

/* ---------------- desk items ---------------- */

export function Lamp() {
    return (
        <g>
            <ellipse cx="78" cy="318" rx="62" ry="12" className="f-black" opacity="0.3" />
            <rect x="24" y="298" width="108" height="20" rx="4" className="f-black" />
            <polygon points="74,300 86,300 132,150 120,146" className="f-black" />
            <polygon points="120,146 132,150 70,58 60,64" className="f-black" />
            <circle cx="126" cy="148" r="9" className="f-black" />
            <g transform="rotate(28 64 60)">
                <polygon points="22,46 108,46 92,0 38,0" className="f-brick" />
                <polygon points="22,46 108,46 104,54 26,54" className="f-amber lamp-bulb" />
                <polygon points="38,0 92,0 96,10 34,10" className="f-black" opacity="0.2" />
            </g>
        </g>
    );
}

export function Tray() {
    return (
        <g>
            <polygon points="0,60 200,60 186,120 14,120" className="f-black" />
            <polygon points="0,60 200,60 196,70 4,70" className="f-cream" opacity="0.1" />
            {[0, 1, 2, 3].map((i) => (
                <polygon key={i} points={`${26 + i * 2},${54 - i * 5} ${176 - i * 2},${54 - i * 5} ${182 - i * 2},${70 - i * 5} ${20 + i * 2},${70 - i * 5}`} className="f-cream" opacity={1 - i * 0.04} />
            ))}
            <polygon points="34,6 166,6 174,40 26,40" className="f-cream" />
            {[14, 20, 26, 32].map((y) => (
                <line key={y} x1={44} y1={y} x2={y === 14 ? 110 : 156} y2={y} className="s-rule" />
            ))}
            <text x="44" y="12" className="card-title" fontSize="7">
                CV
            </text>
        </g>
    );
}

export function Phone() {
    return (
        <g>
            <rect x="4" y="6" width="104" height="52" rx="10" className="f-black" opacity="0.3" />
            <rect x="0" y="0" width="104" height="52" rx="10" className="f-black" />
            <rect x="10" y="8" width="26" height="26" rx="6" className="f-ink" />
            <circle cx="18" cy="16" r="4" className="f-black" />
            <circle cx="28" cy="26" r="4" className="f-black" />
            <rect x="0" y="0" width="104" height="6" rx="3" className="f-cream" opacity="0.08" />
        </g>
    );
}

export function Speaker() {
    return (
        <g>
            <rect x="0" y="0" width="90" height="120" rx="6" className="f-black" />
            <circle cx="45" cy="74" r="26" className="f-ink" />
            <circle cx="45" cy="74" r="10" className="f-black" />
            <circle cx="45" cy="28" r="10" className="f-ink" />
            <rect x="0" y="112" width="90" height="8" className="f-black" opacity="0.4" />
        </g>
    );
}

export function Mug() {
    return (
        <g>
            <g className="steam">
                <path d="M26 8 q-8 -12 0 -24 q8 -12 0 -24" />
                <path d="M42 6 q-8 -12 0 -24 q8 -12 0 -24" />
            </g>
            <rect x="8" y="30" width="54" height="66" rx="6" className="f-cream" />
            <path d="M62 44 h8 a12 12 0 0 1 0 24 h-8" fill="none" className="s-cream-thick" />
            <rect x="8" y="58" width="54" height="12" className="f-brick" />
            <rect x="8" y="30" width="54" height="8" className="f-black" opacity="0.25" />
            <rect x="44" y="30" width="18" height="66" className="f-black" opacity="0.12" />
        </g>
    );
}

export function Plant() {
    return (
        <g>
            <polygon points="62,40 20,0 46,46" className="f-ink" />
            <polygon points="66,46 112,6 80,54" className="f-ink" />
            <polygon points="66,46 112,6 96,28" className="f-black" opacity="0.25" />
            <polygon points="62,60 6,48 52,78" className="f-ink" />
            <polygon points="70,64 128,58 78,86" className="f-ink" />
            <polygon points="70,64 128,58 100,74" className="f-black" opacity="0.25" />
            <polygon points="64,90 62,20 70,20 72,90" className="f-ink" />
            <polygon points="20,96 110,96 98,190 32,190" className="f-brick" />
            <rect x="16" y="90" width="98" height="14" className="f-brick" />
            <rect x="16" y="104" width="98" height="6" className="f-black" opacity="0.2" />
            <polygon points="76,110 98,110 92,190 76,190" className="f-black" opacity="0.12" />
        </g>
    );
}
