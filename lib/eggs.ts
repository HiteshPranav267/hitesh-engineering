"use client";

import { safeStorage, setStorage } from "@/lib/browser";

/** Every easter egg on the site, with the hint shown on /found-it/ until it's found. */
export const EGGS = [
    { id: "found-it", name: "Found the hidden page", hint: "you're here" },
    { id: "burnout", name: "Burnt out the lamp", hint: "the lamp has a limited number of clicks in it" },
    { id: "late", name: "Up between 1 and 4 AM", hint: "visit when you should be asleep (IST)" },
    { id: "weekend", name: "Weekend mode", hint: "come back on a Saturday or Sunday" },
    { id: "dont-open", name: "Opened it anyway", hint: "some notes say not to" },
    { id: "shell", name: "Opened the mini shell", hint: "a key above Tab" },
    { id: "vivado", name: "Tried to run Vivado", hint: "EDA licences are hard to come by" },
    { id: "hire", name: "Used sudo for good", hint: "sudo can do one thing here" },
    { id: "konami", name: "CRT mode", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
    { id: "throw", name: "Threw something", hint: "desk things can be picked up" },
    { id: "saver", name: "Watched the screensaver", hint: "do nothing for a minute" },
    { id: "shake", name: "Shook the phone", hint: "the phone on the desk doesn't like being shaken" },
    { id: "pokemon", name: "Caught a Pokémon", hint: "something round on the shelf" },
    { id: "shiny", name: "Caught a shiny", hint: "1 in 100" },
    { id: "grind", name: "Two hours of notes", hint: "study here for a while" },
] as const;

export type EggId = (typeof EGGS)[number]["id"];

export function foundEggs(): EggId[] {
    try {
        return JSON.parse(safeStorage("local", "eggs") || "[]");
    } catch {
        return [];
    }
}

export function findEgg(id: EggId) {
    const have = foundEggs();
    if (have.includes(id)) return;
    setStorage("local", "eggs", JSON.stringify([...have, id]));
    window.dispatchEvent(new Event("eggfound"));
}
