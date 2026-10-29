// Copies browser-side vendor files that must be served as plain static assets.
import fs from "node:fs";

fs.mkdirSync("public/vendor", { recursive: true });
fs.copyFileSync("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", "public/vendor/pdf.worker.min.mjs");
