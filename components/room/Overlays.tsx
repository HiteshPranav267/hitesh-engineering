"use client";

/* Full-room overlays: the burnt-out lamp, the dark room at night, and the screensaver. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Plane } from "./art";

export interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

/** Ten quick lamp clicks: the bulb dies, only the laptop glows. */
export function Burnout({ screen, onDone }: { screen: () => Rect | null; onDone: () => void }) {
    const root = useRef<HTMLDivElement>(null);
    const glow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDone();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onDone]);

    // Follow the laptop's real screen every frame: parallax, wobbles and resizes all move it.
    // A layout effect, so the first position is set before the overlay is painted.
    useLayoutEffect(() => {
        let raf = 0;
        const tick = () => {
            const s = screen();
            const el = root.current;
            const g = glow.current;
            if (el && g) {
                if (s) {
                    const cx = s.left + s.width / 2;
                    const cy = s.top + s.height / 2;
                    const r = Math.max(s.width, s.height) * 0.95;
                    el.style.background = `radial-gradient(circle ${r}px at ${cx}px ${cy}px, rgb(4 6 9 / 0.78), rgb(4 6 9 / 0.97))`;
                    Object.assign(g.style, { display: "grid", left: `${s.left}px`, top: `${s.top}px`, width: `${s.width}px`, height: `${s.height}px`, fontSize: `${Math.max(18, s.height * 0.15)}px` });
                } else {
                    el.style.background = "rgb(4 6 9 / 0.97)";
                    g.style.display = "none";
                }
            }
            raf = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(raf);
    }, [screen]);

    return (
        <div ref={root} className="burnout" role="dialog" aria-label="The lamp burnt out. Go to sleep." onClick={onDone}>
            <div ref={glow} className="burn-screen">
                Go to sleep.
            </div>
            <button type="button" className="burn-hint" onClick={onDone} autoFocus>
                the bulb blew. click anywhere to change it
            </button>
        </div>
    );
}

/** Night in Bengaluru and the lamp is off: dim the room, point at the lamp. */
export function DarkRoom({ lamp }: { lamp: Rect | null }) {
    if (!lamp) return <div className="dark-room" style={{ background: "rgb(6 8 13 / 0.86)" }} />;
    const lx = lamp.left + lamp.width / 2;
    const ly = lamp.top + lamp.height * 0.35;
    const tx = lamp.left + lamp.width + 16;
    const ty = Math.max(16, lamp.top - 70);
    return (
        <div className="dark-room" style={{ background: `radial-gradient(circle ${Math.max(140, lamp.height * 0.9)}px at ${lx}px ${ly}px, rgb(6 8 13 / 0.5), rgb(6 8 13 / 0.88))` }}>
            <div className="dark-hint" style={{ left: tx, top: ty }}>
                <span>it&apos;s dark in here…</span>
                <span>turn on the lamp?</span>
                <svg width="90" height="70" viewBox="0 0 90 70" aria-hidden="true">
                    <path d="M70 6 C 70 40, 40 58, 8 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 6" />
                    <path d="M18 52 L 6 60 L 19 67" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

const WINGS = ["var(--brick)", "var(--teal)", "var(--amber)", "var(--cream)"];

/** A minute of nothing: the room dims and the paper plane bounces around like an old DVD logo. */
export function Screensaver({ onWake }: { onWake: () => void }) {
    const plane = useRef<HTMLDivElement>(null);
    const [hue, setHue] = useState(0);
    const [corner, setCorner] = useState(0);

    useEffect(() => {
        const el = plane.current!;
        const w = 150;
        const h = 64;
        let x = Math.random() * (innerWidth - w);
        let y = Math.random() * (innerHeight - h);
        let vx = 150;
        let vy = 110;
        let last = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            x += vx * dt;
            y += vy * dt;
            let hitX = false;
            let hitY = false;
            if (x <= 0 || x >= innerWidth - w) {
                x = Math.max(0, Math.min(innerWidth - w, x));
                vx = -vx;
                hitX = true;
            }
            if (y <= 0 || y >= innerHeight - h) {
                y = Math.max(0, Math.min(innerHeight - h, y));
                vy = -vy;
                hitY = true;
            }
            if (hitX || hitY) setHue((c) => (c + 1) % WINGS.length);
            if (hitX && hitY) setCorner((c) => c + 1);
            el.style.transform = `translate(${x}px, ${y}px) scaleX(${vx < 0 ? -1 : 1})`;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const wake = () => onWake();
        const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];
        // Ignore the pointermove that can arrive as the overlay appears.
        const arm = setTimeout(() => events.forEach((e) => window.addEventListener(e, wake, { passive: true })), 400);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(arm);
            events.forEach((e) => window.removeEventListener(e, wake));
        };
    }, [onWake]);

    return (
        <div className="saver" aria-hidden="true">
            <div ref={plane} className="saver-plane" style={{ ["--brick" as string]: WINGS[hue] }}>
                <svg viewBox="0 0 120 50" width="150" height="64">
                    <Plane />
                </svg>
            </div>
            {corner > 0 && (
                <p key={corner} className="saver-corner">
                    it hit the corner!
                </p>
            )}
            <p className="saver-hint">the room is resting. move to wake it</p>
        </div>
    );
}
