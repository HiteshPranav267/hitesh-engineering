"use client";

import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { setTheme, useTheme } from "@/components/ThemeToggle";
import { safeStorage, setStorage } from "@/lib/browser";
import type { ExperienceEntry } from "@/lib/content";
import { findEgg } from "@/lib/eggs";
import { useIst } from "@/lib/ist";
import { asset } from "@/lib/site";
import { Calendar, Clock, DontOpen, FieldNotes, Lamp, Lanyards, Laptop, Mug, NightCoffee, Phone, Plane, Plant, Pokeball, Shelf, Speaker, Stickies, Tablet, Tray, WeekendNote, Window, type SpineGeom, type Waveform } from "./art";
import LaptopOS, { type OsProject, type ScreenRect } from "./LaptopOS";
import { Burnout, DarkRoom, Screensaver, type Rect } from "./Overlays";
import { rollPokemon, spriteUrl } from "./pokemon";
import { Tosser, type Body, type Bounds } from "./toss";
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
    kind: "link" | "laptop" | "external" | "prank" | "theme" | "rain" | "music" | "egg" | "pokeball" | "toy" | "none";
    target: string | null;
    layer: number;
    box: [number, number];
    landscape: Placement;
    portrait: Placement;
    when?: "late" | "weekend";
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
    projects: OsProject[];
}

const DEPTH = [4, 7, 10, 14, 22]; // max parallax travel in px per layer
const COMPS: Comp[] = ["landscape", "portrait"];
const SCREEN = [52, 14, 316, 212]; // the laptop's screen inside its art box (see Laptop in art.tsx)
// Desk things that can be picked up and thrown, and everything that wobbles when the phone shakes.
const THROW = new Set(["fieldnotes", "clock", "dontopen", "weekend", "coffee", "tray", "phone", "speaker", "mug", "plant"]);
const WOBBLE = [...THROW, "laptop", "lamp"];
const IDLE_MS = 60_000;

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

export default function Room({ scene, spines, wave, entries, now, stickies, cards, projects }: Props) {
    const router = useRouter();
    const theme = useTheme();
    const ist = useIst();
    const sky = ist ? (ist.dark ? "night" : "day") : "night"; // 6 AM–6 PM IST is daylight
    const [rain, setRain] = useState(false);
    const [music, setMusic] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const fade = useRef<HTMLDivElement>(null);
    const audio = useRef<HTMLAudioElement>(null);
    const busy = useRef(false);
    const [os, setOs] = useState<ScreenRect | null>(null);
    const osOn = useRef(false); // true from the moment the laptop starts opening
    const [burn, setBurn] = useState(false);
    const lampTimes = useRef<number[]>([]);
    const [lampRect, setLampRect] = useState<Rect | null>(null);
    const [saver, setSaver] = useState(false);
    const lastActive = useRef(0);
    const [poke, setPoke] = useState<{ id: number; name: string; shiny: boolean; comp: Comp } | null>(null);
    const tosser = useRef<Tosser | null>(null);
    const drag = useRef<{ id: string; comp: Comp; sx: number; sy: number; ox: number; oy: number; lx: number; ly: number; lt: number; vx: number; vy: number; on: boolean; el: HTMLElement; pid: number; pm: [number, number]; flips: number[] } | null>(null);
    const suppress = useRef<{ id: string; until: number } | null>(null);

    const shown = (o: SceneObject) => !o.when || (o.when === "late" && !!ist?.late) || (o.when === "weekend" && !!ist?.weekend);

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
            if (osOn.current) return; // the desktop sits on a fixed rect; keep the scene still under it
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

    /** Camera transform that fills the viewport with the laptop's screen. */
    const screenTransform = (comp: Comp) => {
        const frame = camOf(comp).parentElement!;
        const fw = frame.clientWidth;
        const fh = frame.clientHeight;
        const [W, H] = scene.viewBox[comp];
        const l = scene.objects.find((o) => o.id === "laptop")![comp];
        const [bx, by, bw, bh] = [l.x + SCREEN[0] * l.s, l.y + SCREEN[1] * l.s, SCREEN[2] * l.s, SCREEN[3] * l.s];
        const k = Math.min((innerWidth * 0.94) / ((bw / W) * fw), (innerHeight * 0.84) / ((bh / H) * fh));
        return { x: fw / 2 - ((bx + bw / 2) / W) * fw * k, y: fh / 2 - ((by + bh / 2) / H) * fh * k, scale: k };
    };

    const measureScreen = (comp: Comp): ScreenRect | null => {
        const r = root.current?.querySelector(`#laptop-screen-${comp}`)?.getBoundingClientRect();
        return r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
    };

    const openLaptop = () => {
        if (busy.current || osOn.current) return;
        osOn.current = true;
        const comp = visibleComp();
        const cam = camOf(comp);
        const show = () => setOs(measureScreen(comp));
        if (reduceMotion()) {
            gsap.set(cam, { ...screenTransform(comp), transformOrigin: "0 0" });
            show();
            return;
        }
        busy.current = true;
        gsap.to(cam, {
            ...screenTransform(comp),
            transformOrigin: "0 0",
            duration: 0.9,
            ease: "power2.inOut",
            onComplete: () => {
                busy.current = false;
                show();
            },
        });
    };

    const closeLaptop = () => {
        setOs(null);
        osOn.current = false;
        const comp = visibleComp();
        const cam = camOf(comp);
        const refocus = () => root.current?.querySelector<HTMLElement>(`.stage-${comp} [data-hot="laptop"]`)?.focus({ preventScroll: true });
        if (reduceMotion()) {
            gsap.set(cam, { x: 0, y: 0, scale: 1 });
            requestAnimationFrame(refocus);
        } else gsap.to(cam, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "power2.inOut", onComplete: refocus });
    };

    /** Leave from the desktop to a page; coming back pulls out from the laptop. */
    const leaveLaptop = (target: string) => {
        setStorage("session", "room-from", "laptop");
        if (reduceMotion()) router.push(target);
        else gsap.to(fade.current, { opacity: 1, duration: 0.3, onComplete: () => router.push(target) });
    };

    // Keep the desktop glued to the screen when the window changes size.
    const laptopOpen = os !== null;
    useEffect(() => {
        if (!laptopOpen) return;
        const onResize = () => {
            const comp = visibleComp();
            COMPS.forEach((c) => gsap.set(camOf(c), { x: 0, y: 0, scale: 1 }));
            gsap.set(camOf(comp), { ...screenTransform(comp), transformOrigin: "0 0" });
            setOs(measureScreen(comp));
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [laptopOpen]);

    /* ---------- throwing things ---------- */

    const tossBounds = (key: string): Bounds | null => {
        const [comp, id] = key.split(":") as [Comp, string];
        const o = scene.objects.find((x) => x.id === id);
        if (!o) return null;
        const p = o[comp];
        const [W, H] = scene.viewBox[comp];
        return { minX: -p.x, maxX: W - p.x - o.box[0] * p.s, minY: -p.y, maxY: H - p.y - o.box[1] * p.s };
    };

    const tossRender = (key: string, b: Body) => {
        const [comp, id] = key.split(":") as [Comp, string];
        const o = scene.objects.find((x) => x.id === id);
        const stage = root.current?.querySelector<HTMLElement>(`.stage-${comp}`);
        if (!o || !stage) return;
        const p = o[comp];
        stage.querySelector(`[data-toss="${id}"]`)?.setAttribute("transform", `translate(${b.x / p.s} ${b.y / p.s}) rotate(${b.r} ${o.box[0] / 2} ${o.box[1] / 2})`);
        const btn = stage.querySelector<HTMLElement>(`[data-hot="${id}"]`);
        if (btn) {
            const px = stage.querySelector<HTMLElement>(".frame")!.clientWidth / scene.viewBox[comp][0];
            btn.style.translate = `${b.x * px}px ${b.y * px}px`;
            btn.style.rotate = `${b.r}deg`;
        }
    };

    useEffect(() => {
        const t = new Tosser(tossBounds, tossRender);
        tosser.current = t;
        let lastShake = 0;
        // Shake the phone: drag it back and forth fast and everything else on the desk wobbles.
        const shakeCheck = (d: NonNullable<typeof drag.current>, mx: number, my: number, now: number) => {
            if (Math.hypot(mx, my) < 3) return;
            if (mx * d.pm[0] + my * d.pm[1] < 0) d.flips = [...d.flips.filter((f) => now - f < 800), now]; // direction reversed
            d.pm = [mx, my];
            if (d.flips.length >= 4 && now - lastShake > 1000) {
                lastShake = now;
                d.flips = [];
                t.wobble(WOBBLE.filter((id) => id !== "phone").map((id) => `${d.comp}:${id}`));
                findEgg("shake");
            }
        };
        const move = (e: PointerEvent) => {
            const d = drag.current;
            if (!d || e.pointerId !== d.pid) return;
            const dx = e.clientX - d.sx;
            const dy = e.clientY - d.sy;
            const key = `${d.comp}:${d.id}`;
            if (!d.on) {
                if (Math.hypot(dx, dy) < 7) return;
                d.on = true;
                t.grab(key);
                d.el.classList.add("held");
                try {
                    d.el.setPointerCapture(d.pid);
                } catch {}
            }
            const frame = camOf(d.comp).parentElement!;
            const unit = scene.viewBox[d.comp][0] / frame.clientWidth;
            const now = performance.now();
            const dt = Math.max(1, now - d.lt);
            if (d.id === "phone") shakeCheck(d, e.clientX - d.lx, e.clientY - d.ly, now);
            d.vx = d.vx * 0.5 + ((e.clientX - d.lx) / dt) * 1000 * unit * 0.5;
            d.vy = d.vy * 0.5 + ((e.clientY - d.ly) / dt) * 1000 * unit * 0.5;
            d.lx = e.clientX;
            d.ly = e.clientY;
            d.lt = now;
            t.drag(key, d.ox + dx * unit, d.oy + dy * unit, d.vx);
        };
        const up = (e: PointerEvent) => {
            const d = drag.current;
            if (!d || e.pointerId !== d.pid) return;
            drag.current = null;
            if (!d.on) return;
            suppress.current = { id: d.id, until: performance.now() + 400 };
            d.el.classList.remove("held");
            const still = performance.now() - d.lt > 90; // let go after stopping: just drop it
            const clamp = (v: number) => Math.max(-4200, Math.min(4200, v));
            t.release(`${d.comp}:${d.id}`, still ? 0 : clamp(d.vx), still ? 0 : clamp(d.vy));
            findEgg("throw");
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", up);
            t.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onHotDown = (e: ReactPointerEvent<HTMLButtonElement>, o: SceneObject) => {
        if (!THROW.has(o.id) || osOn.current || e.button !== 0) return;
        const comp = visibleComp();
        const b = tosser.current?.body(`${comp}:${o.id}`);
        if (!b) return;
        drag.current = { id: o.id, comp, sx: e.clientX, sy: e.clientY, ox: b.x, oy: b.y, lx: e.clientX, ly: e.clientY, lt: performance.now(), vx: 0, vy: 0, on: false, el: e.currentTarget, pid: e.pointerId, pm: [0, 0], flips: [] };
    };

    /* ---------- screensaver after a minute of nothing ---------- */
    useEffect(() => {
        if (reduceMotion()) return;
        lastActive.current = Date.now();
        const bump = () => (lastActive.current = Date.now());
        const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];
        events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
        const id = setInterval(() => {
            if (document.visibilityState !== "visible" || osOn.current || drag.current || root.current?.querySelector(".burnout, .mini-shell")) {
                lastActive.current = Date.now();
                return;
            }
            if (Date.now() - lastActive.current > IDLE_MS) setSaver(true);
        }, 1000);
        return () => {
            clearInterval(id);
            events.forEach((e) => window.removeEventListener(e, bump));
        };
    }, []);

    useEffect(() => {
        if (saver) findEgg("saver");
    }, [saver]);

    const wake = useCallback(() => {
        lastActive.current = Date.now();
        setSaver(false);
    }, []);

    /* ---------- lamp: ten quick clicks burn it out ---------- */
    const toggleLamp = () => {
        const now = Date.now();
        lampTimes.current = [...lampTimes.current.filter((t) => now - t < 5000), now];
        if (lampTimes.current.length >= 10) {
            lampTimes.current = [];
            setBurn(true);
            findEgg("burnout");
            return;
        }
        setTheme(theme === "night" ? "day" : "night");
    };
    const endBurn = useCallback(() => setBurn(false), []);
    // Read live by the burnout overlay so "Go to sleep." stays on the laptop as the room moves.
    const burnScreen = useCallback(() => measureScreen(visibleComp()), []);

    /* ---------- night outside, lamp off: dim the room and point at the lamp ---------- */
    const darkRoom = !!ist?.dark && theme === "day" && !burn && !os;
    useEffect(() => {
        if (!darkRoom) return;
        const measure = () => {
            const r = root.current?.querySelector(`.stage-${visibleComp()} [data-hot="lamp"]`)?.getBoundingClientRect();
            setLampRect(r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null);
        };
        const raf = requestAnimationFrame(() => whenStyled(root.current, measure));
        window.addEventListener("resize", measure);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", measure);
        };
         
    }, [darkRoom]);

    /* ---------- late night and weekends ---------- */
    useEffect(() => {
        if (ist?.late) findEgg("late");
        if (ist?.weekend) findEgg("weekend");
    }, [ist?.late, ist?.weekend]);

    /* ---------- the Poké Ball ---------- */
    const openPokeball = () => {
        const comp = visibleComp();
        setPoke(null);
        tosser.current?.wobble([`${comp}:pokeball`]);
        setTimeout(() => {
            const p = rollPokemon();
            setPoke({ ...p, comp });
            findEgg("pokemon");
            if (p.shiny) findEgg("shiny");
        }, reduceMotion() ? 0 : 650);
    };

    useEffect(() => {
        if (!poke) return;
        const t = setTimeout(() => setPoke(null), 8000);
        const away = (e: PointerEvent) => {
            const el = e.target as HTMLElement;
            if (!el.closest(".poke-card, .hot-pokeball")) setPoke(null);
        };
        window.addEventListener("pointerdown", away);
        return () => {
            clearTimeout(t);
            window.removeEventListener("pointerdown", away);
        };
    }, [poke]);

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
        if (suppress.current?.id === o.id && performance.now() < suppress.current.until) {
            suppress.current = null; // that was a throw, not a click
            return;
        }
        if (o.kind === "link" && o.target) go(o.id, o.target);
        else if (o.kind === "laptop") openLaptop();
        // Opened straight from the click so pop-up blockers allow the new tab.
        else if (o.kind === "external" && o.target) window.open(o.target, "_blank", "noopener,noreferrer");
        else if (o.kind === "prank" && o.target) {
            findEgg("dont-open");
            window.location.href = o.target;
        } else if (o.kind === "theme") toggleLamp();
        else if (o.kind === "pokeball") openPokeball();
        else if (o.kind === "toy") tosser.current?.hop(`${visibleComp()}:${o.id}`);
        else if (o.kind === "rain") setRain((r) => !r);
        else if (o.kind === "music") toggleMusic();
        else if (o.kind === "egg") flyPlane();
    };

    const labelFor = (o: SceneObject) => {
        if (o.kind === "theme") return `${o.label} (lamp ${theme === "night" ? "on" : "off"})`;
        if (o.kind === "rain") return `${o.label} (${rain ? "on" : "off"})`;
        if (o.kind === "music") return scene.music.src ? `${o.label} (${music ? "playing" : "off"})` : `${o.label} (no track yet)`;
        if (o.kind === "external") return `${o.label} (opens in a new tab)`;
        if (o.id === "clock") return `${o.label}: ${ist?.hhmm ?? "--:--"} IST`;
        if (o.id === "mug" && ist?.weekend) return "Filter coffee (it's the weekend)";
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
            case "tablet":
                return <Tablet />;
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
                return <Mug filter={!!ist?.weekend} />;
            case "clock":
                return <Clock hhmm={ist?.hhmm ?? "--:--"} sub={ist?.late ? "awake yet?" : `${(ist?.weekday ?? "").toLowerCase()} · IST`} />;
            case "coffee":
                return <NightCoffee />;
            case "weekend":
                return <WeekendNote />;
            case "dontopen":
                return <DontOpen />;
            case "pokeball":
                return <Pokeball />;
            case "plant":
                return <Plant />;
            default:
                return null;
        }
    };

    const place = (p: Placement) => `translate(${p.x} ${p.y}) scale(${p.s})`;

    return (
        <div ref={root} className={`room${rain ? " raining" : ""}${os ? " os-open" : ""}`}>
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
                    <div key={comp} className={`stage stage-${comp}`} inert={laptopOpen}>
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
                                                .filter((o) => o.layer === layer && shown(o))
                                                .map((o) => (
                                                    <g key={o.id} id={`${o.id}-${comp}`} transform={place(o[comp])}>
                                                        <g data-toss={o.id}>{art(o, comp)}</g>
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
                                        .filter((o) => o.kind !== "none" && shown(o))
                                        .map((o) => {
                                            const p = o[comp];
                                            const pressed = o.kind === "theme" ? theme === "night" : o.kind === "rain" ? rain : o.kind === "music" ? music : undefined;
                                            const button = (
                                                <button
                                                    key={o.id}
                                                    type="button"
                                                    className={`hot hot-${o.id}${THROW.has(o.id) ? " throwable" : ""}`}
                                                    data-hot={o.id}
                                                    data-layer={o.layer}
                                                    aria-label={labelFor(o)}
                                                    aria-pressed={pressed}
                                                    aria-disabled={o.kind === "music" && !scene.music.src ? true : undefined}
                                                    style={{ left: pct(p.x, W), top: pct(p.y, H), width: pct(o.box[0] * p.s, W), height: pct(o.box[1] * p.s, H) }}
                                                    onClick={() => activate(o)}
                                                    onPointerDown={(e) => onHotDown(e, o)}
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
                                                        aria-label={`${s.subject} notebook, ${s.pages} pages — open the notes`}
                                                        style={{ left: pct(p.x + s.x * p.s, W), top: pct(p.y + s.y * p.s, H), width: pct(s.w * p.s, W), height: pct(s.h * p.s, H) }}
                                                        onClick={() => go(`spine:${s.slug}`, `/notes/${s.slug}/`)}
                                                    >
                                                        <span className="tag">{s.subject}</span>
                                                    </button>
                                                )),
                                            ];
                                        })}
                                    {poke &&
                                        poke.comp === comp &&
                                        (() => {
                                            const o = scene.objects.find((x) => x.id === "pokeball")!;
                                            const p = o[comp];
                                            return (
                                                <div className={`poke-card${poke.shiny ? " shiny" : ""}`} role="status" style={{ left: pct(p.x + (o.box[0] * p.s) / 2, W), top: pct(p.y, H) }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={spriteUrl(poke.id, poke.shiny)} alt="" width={96} height={96} onError={(e) => (e.currentTarget.style.display = "none")} />
                                                    <p>
                                                        {poke.shiny ? (
                                                            <>
                                                                ✨ A <strong>shiny {poke.name}</strong>!<br />
                                                                <span className="poke-small">1 in 100. Screenshot it.</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                A wild <strong>{poke.name}</strong> appeared!
                                                                <br />
                                                                <span className="poke-small">#{String(poke.id).padStart(3, "0")}</span>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        })()}
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
            {os && <LaptopOS rect={os} projects={projects} wave={wave} onOpen={leaveLaptop} onClose={closeLaptop} />}
            {darkRoom && <DarkRoom lamp={lampRect} />}
            {burn && <Burnout screen={burnScreen} onDone={endBurn} />}
            {saver && !os && !burn && <Screensaver onWake={wake} />}
            <p className="room-hint">{os ? "Esc or ⏻ closes the laptop. Alt+1/2/3 switches workspaces." : "Click an object, or Tab through them. The lamp switches light and dark."}</p>
        </div>
    );
}
