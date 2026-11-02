// Prints the built /cv page (print styles, Computer Modern) to public/Resume_*.pdf.
// Usage: npm run build && node scripts/cv-pdf.mjs   (then rebuild so out/ has the new PDF)
// Uses Chrome or Edge; set CHROME_PATH to point at another Chromium browser.
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 4190;
const OUT = path.resolve("public/Resume_Duggireddy_Hitesh_Pranav_Reddy.pdf");
const browser = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
].find((p) => p && fs.existsSync(p));
if (!browser) throw new Error("No Chrome or Edge found; set CHROME_PATH.");
if (!fs.existsSync("out/cv/index.html")) throw new Error("Run `npm run build` first.");

const server = spawn(process.execPath, ["scripts/serve-out.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
try {
    execFileSync(browser, [
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--virtual-time-budget=10000", // let the web font load before printing
        `--print-to-pdf=${OUT}`,
        `http://localhost:${PORT}/hitesh-engineering/cv/`,
    ], { stdio: "ignore" });
} finally {
    server.kill();
}
console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
