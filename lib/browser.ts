"use client";

import { useSyncExternalStore } from "react";

/** Subscribe to a window event and read a browser-only value; `fallback` is used during prerender. */
export function useBrowserValue<T>(events: string[], read: () => T, fallback: T): T {
    return useSyncExternalStore(
        (cb) => {
            events.forEach((e) => window.addEventListener(e, cb));
            return () => events.forEach((e) => window.removeEventListener(e, cb));
        },
        read,
        () => fallback,
    );
}

export function safeStorage(kind: "local" | "session", key: string): string | null {
    try {
        return (kind === "local" ? localStorage : sessionStorage).getItem(key);
    } catch {
        return null;
    }
}

export function setStorage(kind: "local" | "session", key: string, value: string) {
    try {
        (kind === "local" ? localStorage : sessionStorage).setItem(key, value);
    } catch {}
    window.dispatchEvent(new Event("storagechange"));
}

/** Replace the URL without navigation and notify useLocation() subscribers. */
export function replaceUrl(url: string) {
    history.replaceState(null, "", url);
    window.dispatchEvent(new Event("locationchange"));
}

export const useLocation = () =>
    useBrowserValue(["hashchange", "popstate", "locationchange"], () => window.location.search + window.location.hash, "");
