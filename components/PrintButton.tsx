"use client";

// Load the print font (see app/cv/page.tsx) before opening the dialog, so the first print isn't in a fallback.
async function print() {
    const family = getComputedStyle(document.querySelector(".cv") ?? document.body).getPropertyValue("--font-cm");
    if (family) await Promise.all(["400", "700"].map((w) => document.fonts.load(`${w} 1em ${family}`).catch(() => {})));
    window.print();
}

export default function PrintButton() {
    return (
        <button type="button" className="text-button meta" onClick={print}>
            Print
        </button>
    );
}
