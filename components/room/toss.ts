/*
 * Pick-up-and-throw for desk objects. Each body is an offset (viewBox units) and a
 * rotation on top of the object's normal placement. Thrown bodies fall, bounce off
 * the edges of the scene, then glide back home after a few seconds.
 */

import gsap from "gsap";

export interface Body {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    vr: number;
    held: boolean;
    flying: boolean;
    home: number; // time (ms) to start gliding home
}

export interface Bounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

const GRAVITY = 2600; // viewBox units / s²
const HOME_AFTER = 2800;

export class Tosser {
    private bodies = new Map<string, Body>();
    private raf = 0;
    private last = 0;

    constructor(
        private bounds: (key: string) => Bounds | null,
        private render: (key: string, b: Body) => void,
    ) {}

    body(key: string): Body {
        let b = this.bodies.get(key);
        if (!b) {
            b = { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0, held: false, flying: false, home: 0 };
            this.bodies.set(key, b);
        }
        return b;
    }

    busy(key: string) {
        const b = this.bodies.get(key);
        return !!b && (b.held || b.flying || gsap.isTweening(b));
    }

    grab(key: string) {
        const b = this.body(key);
        gsap.killTweensOf(b);
        b.held = true;
        b.flying = false;
        return b;
    }

    drag(key: string, x: number, y: number, vx: number) {
        const b = this.body(key);
        const lim = this.bounds(key);
        b.x = lim ? Math.max(lim.minX, Math.min(lim.maxX, x)) : x;
        b.y = lim ? Math.max(lim.minY, Math.min(lim.maxY, y)) : y;
        b.r += (Math.max(-30, Math.min(30, vx * 0.02)) - b.r) * 0.25; // lean into the motion
        this.render(key, b);
    }

    release(key: string, vx: number, vy: number) {
        const b = this.body(key);
        b.held = false;
        b.flying = true;
        b.vx = vx;
        b.vy = vy;
        b.vr = vx * 0.12;
        b.home = performance.now() + HOME_AFTER;
        this.loop();
    }

    /** A little jump in place (click on a toy). */
    hop(key: string) {
        const b = this.body(key);
        if (this.busy(key)) return;
        gsap.timeline({ onUpdate: () => this.render(key, b) })
            .to(b, { y: -22, r: -6, duration: 0.16, ease: "power2.out" })
            .to(b, { y: 0, r: 0, duration: 0.4, ease: "bounce.out" });
    }

    /** Shake: everything wobbles a bit. */
    wobble(keys: string[]) {
        keys.forEach((key) => {
            const b = this.body(key);
            if (b.held || b.flying) return;
            gsap.killTweensOf(b);
            const tl = gsap.timeline({ onUpdate: () => this.render(key, b) });
            for (let i = 0; i < 6; i++) tl.to(b, { r: (i % 2 ? -1 : 1) * (4 + Math.random() * 7), y: -Math.random() * 10, x: (Math.random() - 0.5) * 8, duration: 0.07, ease: "sine.inOut" });
            tl.to(b, { x: 0, y: 0, r: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        });
    }

    private loop() {
        if (this.raf) return;
        this.last = performance.now();
        const tick = (now: number) => {
            const dt = Math.min(0.033, (now - this.last) / 1000);
            this.last = now;
            let alive = false;
            this.bodies.forEach((b, key) => {
                if (!b.flying) return;
                alive = true;
                b.vy += GRAVITY * dt;
                b.x += b.vx * dt;
                b.y += b.vy * dt;
                b.r += b.vr * dt;
                const lim = this.bounds(key);
                if (lim) {
                    if (b.x < lim.minX || b.x > lim.maxX) {
                        b.x = Math.max(lim.minX, Math.min(lim.maxX, b.x));
                        b.vx *= -0.55;
                        b.vr *= -0.6;
                    }
                    if (b.y < lim.minY) {
                        b.y = lim.minY;
                        b.vy *= -0.4;
                    }
                    if (b.y > lim.maxY) {
                        b.y = lim.maxY;
                        b.vy = Math.abs(b.vy) < 120 ? 0 : -b.vy * 0.42;
                        b.vx *= 0.78;
                        b.vr *= 0.7;
                    }
                }
                this.render(key, b);
                if (now > b.home) {
                    b.flying = false;
                    gsap.to(b, { x: 0, y: 0, r: 0, duration: 1, ease: "power3.inOut", onUpdate: () => this.render(key, b) });
                }
            });
            this.raf = alive ? requestAnimationFrame(tick) : 0;
        };
        this.raf = requestAnimationFrame(tick);
    }

    destroy() {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
        this.bodies.forEach((b) => gsap.killTweensOf(b));
    }
}
