// Serves out/ under the GitHub Pages basePath, for checking a static build locally.
// Usage: node scripts/serve-out.mjs [port]
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const BASE = "/hitesh-engineering";
const ROOT = path.resolve("out");
const port = Number(process.argv[2] || 4173);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".pdf": "application/pdf", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".dzi": "application/xml", ".pagefind": "application/octet-stream", ".pf_meta": "application/octet-stream", ".pf_index": "application/octet-stream", ".pf_fragment": "application/octet-stream", ".mp3": "audio/mpeg" };

http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    if (!url.startsWith(BASE)) {
        res.writeHead(302, { Location: BASE + "/" }).end();
        return;
    }
    let file = path.join(ROOT, url.slice(BASE.length));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
        res.writeHead(404, { "Content-Type": TYPES[".html"] });
        fs.createReadStream(path.join(ROOT, "404.html")).pipe(res);
        return;
    }
    const size = fs.statSync(file).size;
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || "");
    if (range) {
        const start = Number(range[1]);
        const end = range[2] ? Number(range[2]) : size - 1;
        res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
        fs.createReadStream(file, { start, end }).pipe(res);
        return;
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`http://localhost:${port}${BASE}/`));
