"use client";

import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { setTheme, useTheme } from "@/components/ThemeToggle";
import { safeStorage, setStorage, useBrowserValue } from "@/lib/browser";
import type { ExperienceEntry } from "@/lib/content";
import { asset } from "@/lib/site";
import { Calendar, FieldNotes, Lamp, Lanyards, Laptop, Mug, Phone, Plane, Plant, Shelf, Speaker, Stickies, Tray, Window, type SpineGeom, type Waveform } from "./art";
import "./room.css";

type Comp = "landscape" | "portrait";

interface Placement {
    x: number;
    y: number;
    s: number;
}

export interface SceneObject {
    id: string;
    label: string;
    kind: "link" | "theme" | "rain" | "music" | "egg" | "none";
    target: string | null;
    layer: number;
    box: [number, number];
    landscape: Placement;
    portrait: Placement;
}

export interface Scene {
    viewBox: Record<Comp, [number, number]>;
    deskTop: Record<Comp, number>;
    cable: Record<Comp, { c1: [number, number]; c2: [number, number]; end: [number, number] }>;
    music: { src: string | null; credit: string | null };
    objects: SceneObject[];
}

interface Props {
    scene: Scene;
    spines: SpineGeom[];
    wave: Waveform;
    entries: ExperienceEntry[];
    now: string;
    stickies: string[][];
    cards: { title: string; sub: string; cls: string }[];
}

const DEPTH = [4, 7, 10, 14, 22]; // max parallax travel in px per layer
const COMPS: Comp[] = ["landscape", "portrait"];

function skyFor(hour: number): "day" | "sunset" | "night" {
    if (hour >= 7 && hour < 17) return "day";
    if ((hour >= 17 && hour < 19) || hour === 6) return "sunset";
    return "night";
}

/** Run once room.css has applied (on client navigation the stylesheet can land after mount). */
function whenStyled(el: HTMLElement | null, cb: () => void) {
    let tries = 0;
    const tick = () => {
        if (!el) return;
        if (getComputedStyle(el).position === "fixed" || tries++ > 120) cb();
        else requestAnimationFrame(tick);
    };
    tick();
}

const reduceMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Box of an object (or a spine on the shelf) in viewBox units for one composition. */
function boxFor(scene: Scene, spines: SpineGeom[], comp: Comp, id: string): [number, number, number, number] | null {
    if (id.startsWith("spine:")) {
        const sp = spines.find((s) => s.slug === id.slice(6));
        const shelf = scene.objects.find((o) => o.id === "shelf")!;
        if (!sp) return null;
        const p = shelf[comp];
        return [p.x + sp.x * p.s, p.y + sp.y * p.s, sp.w * p.s, sp.h * p.s];
    }
    const o = scene.objects.find((x) => x.id === id);
    if (!o) return null;
    const p = o[comp];
    return [p.x, p.y, o.box[0] * p.s, o.box[1] * p.s];
}

export default function Room({ scene, spines, wave, entries, now, stickies, cards }: Props) {
    const router = useRouter();
    const theme = useTheme();
    const sky = useBrowserValue(["focus", "visibilitychange"], () => skyFor(new Date().getHours()), "night");
    const [rain, setRain] = useState(false);
    const [music, setMusic] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const fade = useRef<HTMLDivElement>(null);
    const audio = useRef<HTMLAudioElement>(null);
    const busy = useRef(false);

    const visibleComp = (): Comp => {
        const el = root.current?.querySelector<HTMLElement>(".stage-portrait");
        return el && getComputedStyle(el).display !== "none" ? "portrait" : "landscape";
    };
    const camOf = (comp: Comp) => root.current!.querySelector<HTMLElement>(`.stage-${comp} .cam`)!;

    /** Transform that brings box `b` to the centre of the frame. */
    const focusTransform = (comp: Comp, b: [number, number, number, number]) => {
        const frame = camOf(comp).parentElement!;
        const fw = frame.clientWidth;
        const fh = frame.clientHeight;
        const [W, H] = scene.viewBox[comp];
        const cx = ((b[0] + b[2] / 2) / W) * fw;
        const cy = ((b[1] + b[3] / 2) / H) * fh;
        const k = Math.max(1.7, Math.min(3.2, Math.min(fw / ((b[2] / W) * fw * 2.6), fh / ((b[3] / H) * fh * 2.6))));
        return { x: fw / 2 - cx * k, y: fh / 2 - cy * k, scale: k };
    };

    // Pointer parallax: each layer drifts by a different amount.
    useEffect(() => {
        if (reduceMotion()) return;
        const proxy = { x: 0, y: 0 };
        const apply = () => {
            COMPS.forEach((comp) => {
                const stage = root.current?.querySelector<HTMLElement>(`.stage-${comp}`);
                if (!stage || getComputedStyle(stage).display === "none") return;
                const frame = stage.querySelector<HTMLElement>(".frame")!;
                const unit = scene.viewBox[comp][0] / frame.clientWidth;
                DEPTH.forEach((d, layer) => {
                    const dx = -proxy.x * d;
                    const dy = -proxy.y * d * 0.6;
                    stage.querySelector(`.scene g[data-layer="${layer}"]`)?.setAttribute("transform", `translate(${dx * unit} ${dy * unit})`);
                    stage.querySelectorAll<HTMLElement>(`.hot[data-layer="${layer}"]`).forEach((h) => (h.style.transform = `translate(${dx}px, ${dy}px)`));
                });
            });
        };
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            gsap.to(proxy, { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1, duration: 0.9, ease: "power3.out", overwrite: true, onUpdate: apply });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
    }, [scene]);

    // Coming back from an object's page: start pushed in on it, then pull the camera out.
    useEffect(() => {
        // Set by the "Back to the room" link; ?from=<id> also works for direct links.
        // The URL is left alone: rewriting it makes the app router re-render the page.
        const from = safeStorage("session", "room-return") || new URLSearchParams(location.search).get("from");
        if (!from) return;
        setStorage("session", "room-return", "");
        whenStyled(root.current, () => pullOut(from));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pullOut = (from: string) => {
        const comp = visibleComp();
        const b = boxFor(scene, spines, comp, from);
        const btn = root.current?.querySelector<HTMLElement>(`.stage-${comp} [data-hot="${from}"]`);
        if (b && !reduceMotion()) {
            const cam = camOf(comp);
            gsap.set(cam, { ...focusTransform(comp, b), transformOrigin: "0 0" });
            gsap.set(fade.current, { opacity: 1 });
            gsap.to(fade.current, { opacity: 0, duration: 0.35 });
            gsap.to(cam, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "power2.inOut", onComplete: () => btn?.focus({ preventScroll: true }) });
        } else btn?.focus({ preventScroll: true });
    };

    const go = (id: string, target: string) => {
        if (busy.current) return;
        setStorage("session", "room-from", id);
        const comp = visibleComp();
        const b = boxFor(scene, spines, comp, id);
        if (!b || reduceMotion()) {
            router.push(target);
            return;
        }
        busy.current = true;
        const cam = camOf(comp);
        const tl = gsap.timeline({ onComplete: () => router.push(target) });
        if (id.startsWith("spine:")) {
            const spine = root.current!.querySelector(`.stage-${comp} #spine-${id.slice(6)}`);
            tl.to(spine, { y: -26, duration: 0.3, ease: "power2.out" });
        }
        tl.to(cam, { ...focusTransform(comp, b), transformOrigin: "0 0", duration: 0.85, ease: "power2.inOut" });
        tl.to(fade.current, { opacity: 1, duration: 0.25 }, "-=0.25");
    };

    const flyPlane = () => {
        if (reduceMotion()) return;
        const comp = visibleComp();
        const plane = root.current!.querySelector(`.stage-${comp} #plane-body`);
        gsap.timeline()
            .to(plane, { x: -70, y: -40, rotation: -14, duration: 0.7, ease: "sine.inOut", transformOrigin: "50% 50%" })
            .to(plane, { x: -150, y: -10, rotation: 8, duration: 0.7, ease: "sine.inOut" })
            .to(plane, { x: 0, y: 0, rotation: 0, duration: 1, ease: "sine.inOut" });
    };

    const toggleMusic = () => {
        const a = audio.current;
        if (!a) return;
        if (a.paused) {
            a.play().then(() => setMusic(true)).catch(() => setMusic(false));
        } else {
            a.pause();
            setMusic(false);
        }
    };

    const activate = (o: SceneObject) => {
        if (o.kind === "link" && o.target) go(o.id, o.target);
        else if (o.kind === "theme") setTheme(theme === "night" ? "day" : "night");
        else if (o.kind === "rain") setRain((r) => !r);
        else if (o.kind === "music") toggleMusic();
        else if (o.kind === "egg") flyPlane();
    };

    const labelFor = (o: SceneObject) => {
        if (o.kind === "theme") return `${o.label} (lamp ${theme === "night" ? "on" : "off"})`;
        if (o.kind === "rain") return `${o.label} (${rain ? "on" : "off"})`;
        if (o.kind === "music") return scene.music.src ? `${o.label} (${music ? "playing" : "off"})` : `${o.label} (no track yet)`;
        return o.label;
    };

    const art = (o: SceneObject, comp: Comp): ReactNode => {
        switch (o.id) {
            case "laptop":
                return <Laptop wave={wave} uid={comp} />;
            case "fieldnotes":
                return <FieldNotes />;
            case "shelf":
                return <Shelf spines={spines} />;
            case "plane":
                return <Plane />;
            case "stickies":
                return <Stickies lines={stickies} />;
            case "calendar":
                return <Calendar entries={entries} now={now} />;
            case "lanyards":
                return <Lanyards cards={cards} />;
            case "tray":
                return <Tray />;
            case "phone":
                return <Phone />;
            case "lamp":
                return <Lamp />;
            case "window":
                return <Window sky={sky} uid={comp} />;
            case "speaker":
                return <Speaker />;
            case "mug":
                return <Mug />;
            case "plant":
                return <Plant />;
            default:
                return null;
        }
    };

    const place = (p: Placement) => `translate(${p.x} ${p.y}) scale(${p.s})`;

    return (
        <div ref={root} className={`room${rain ? " raining" : ""}`}>
            <Link className="room-list-link" href="/list/">
                View as list
            </Link>
            {COMPS.map((comp) => {
                const [W, H] = scene.viewBox[comp];
                const deskTop = scene.deskTop[comp];
                const lamp = scene.objects.find((o) => o.id === "lamp")!;
                const shelf = scene.objects.find((o) => o.id === "shelf")!;
                const pct = (v: number, of: number) => `${(v / of) * 100}%`;
                return (
                    <div key={comp} className={`stage stage-${comp}`}>
                        <div className="frame" style={{ aspectRatio: `${W} / ${H}` }}>
                            <div className="cam">
                                <svg className="scene" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
                                    <defs>
                                        <filter id={`soft-${comp}`} x="-50%" y="-50%" width="200%" height="200%">
                                            <feGaussianBlur stdDeviation="28" />
                                        </filter>
                                    </defs>
                                    {[0, 1, 2, 3, 4].map((layer) => (
                                        <g key={layer} data-layer={layer}>
                                            {layer === 0 && (
                                                <>
                                                    <rect x={-2000} y={-2000} width={W + 4000} height={deskTop + 2000} className="f-ink" />
                                                    <rect x={-2000} y={deskTop - 96} width={W + 4000} height="96" className="f-black" opacity="0.12" />
                                                    <rect x={-2000} y={deskTop - 100} width={W + 4000} height="4" className="f-black" opacity="0.2" />
                                                </>
                                            )}
                                            {layer === 2 && (
                                                <>
                                                    <rect x={-2000} y={deskTop} width={W + 4000} height={H - deskTop + 2000} className="f-teal" />
                                                    <rect x={-2000} y={deskTop} width={W + 4000} height="10" className="f-black" opacity="0.28" />
                                                    <rect x={-2000} y={H - 70} width={W + 4000} height="2000" className="f-black" opacity="0.12" />
                                                </>
                                            )}
                                            {scene.objects
                                                .filter((o) => o.layer === layer)
                                                .map((o) => (
                                                    <g key={o.id} id={`${o.id}-${comp}`} transform={place(o[comp])}>
                                                        {art(o, comp)}
                                                    </g>
                                                ))}
                                            {layer === 3 && (
                                                <g transform={place(lamp[comp])} className="lamp-light" filter={`url(#soft-${comp})`}>
                                                    <polygon points="40,84 128,118 600,470 140,540" className="f-amber" />
                                                    <ellipse cx="80" cy="74" rx="130" ry="100" className="f-amber" />
                                                </g>
                                            )}
                                            {layer === 4 && (() => {
                                                const l = scene.objects.find((o) => o.id === "laptop")![comp];
                                                const sx = l.x + 404 * l.s;
                                                const sy = l.y + 278 * l.s;
                                                const c = scene.cable[comp];
                                                return <path d={`M${sx} ${sy} C ${c.c1.join(" ")}, ${c.c2.join(" ")}, ${c.end.join(" ")}`} className="cable" />;
                                            })()}
                                        </g>
                                    ))}
                                </svg>
                                {/* One container in scene.json order, so Tab follows the room, not the layers. */}
                                <div className="hot-layer">
                                    {scene.objects
                                        .filter((o) => o.kind !== "none")
                                        .map((o) => {
                                            const p = o[comp];
                                            const pressed = o.kind === "theme" ? theme === "night" : o.kind === "rain" ? rain : o.kind === "music" ? music : undefined;
                                            const button = (
                                                <button
                                                    key={o.id}
                                                    type="button"
                                                    className={`hot hot-${o.id}`}
                                                    data-hot={o.id}
                                                    data-layer={o.layer}
                                                    aria-label={labelFor(o)}
                                                    aria-pressed={pressed}
                                                    aria-disabled={o.kind === "music" && !scene.music.src ? true : undefined}
                                                    style={{ left: pct(p.x, W), top: pct(p.y, H), width: pct(o.box[0] * p.s, W), height: pct(o.box[1] * p.s, H) }}
                                                    onClick={() => activate(o)}
                                                >
                                                    <span className="tag">{labelFor(o)}</span>
                                                </button>
                                            );
                                            if (o.id !== "shelf") return button;
                                            return [
                                                button,
                                                ...spines.map((s) => (
                                                    <button
                                                        key={s.slug}
                                                        type="button"
                                                        className="hot spine-hot"
                                                        data-hot={`spine:${s.slug}`}
                                                        data-layer={shelf.layer}
                                                        aria-label={`${s.subject} notebook, ${s.pages} pages — open on the desk`}
                                                        style={{ left: pct(p.x + s.x * p.s, W), top: pct(p.y + s.y * p.s, H), width: pct(s.w * p.s, W), height: pct(s.h * p.s, H) }}
                                                        onClick={() => go(`spine:${s.slug}`, `/desk/${s.slug}/`)}
                                                    >
                                                        <span className="tag">{s.subject}</span>
                                                    </button>
                                                )),
                                            ];
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <svg className="grain" aria-hidden="true">
                <filter id="grain-f">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain-f)" />
            </svg>
            <div ref={fade} className="room-fade" />
            {scene.music.src && <audio ref={audio} src={asset(scene.music.src)} loop preload="none" />}
            <p className="room-hint">Click an object, or Tab through them. The lamp switches light and dark.</p>
        </div>
    );
}
