"use client";

export default function PrintButton() {
    return (
        <button type="button" className="text-button meta" onClick={() => window.print()}>
            Print
        </button>
    );
}
