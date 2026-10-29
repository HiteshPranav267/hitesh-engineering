"""Build note metadata, thumbnails and deep-zoom desk tiles from private/notes/.

Inputs
  private/notes/**/*.pdf      handwritten note PDFs (one per unit)
  private/notes/_seed.yaml    subject / year / semester / department / title per PDF
  content/notes.yaml          previous output; hand-edited `topics`, `semester`
                              and `unit` values are carried over on rebuild

Outputs
  content/notes.yaml                         one entry per subject (committed)
  public/notes-covers/<subject>.jpg          first-page cover, 360 px wide (committed)
  public/notes-dev/thumbs/<subject>/<stem>/pNNN.jpg   per-page thumbnails (gitignored)
  public/notes-dev/desk/<subject>.dzi        deep-zoom desk, one per subject (gitignored)
  public/notes-dev/desk/shelf.dzi            every subject on one desk (gitignored)
  public/notes-dev/desk/<name>.json          page rectangles on each desk image

Usage
  scripts/notes/.venv/Scripts/python scripts/notes/build.py [--only SUBJECT_SLUG] [--no-tiles]
"""

from __future__ import annotations

import argparse
import html
import datetime as dt
import json
import math
import re
import shutil
import subprocess
import sys
from pathlib import Path

import pymupdf
import pyvips
import yaml

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "private" / "notes"
SEED = SRC / "_seed.yaml"
OUT_YAML = ROOT / "content" / "notes.yaml"
COVERS = ROOT / "public" / "notes-covers"
DEV = ROOT / "public" / "notes-dev"
CACHE = DEV / "_cache"

PAGE_W, PAGE_H = 1100, 1556  # full-resolution desk cell (A4 ratio)
THUMB_W = 220
COVER_W = 360
COLS = 8  # pages per row on a subject desk
GAP = 90
DESK_BG = [201, 191, 174]
INK = [43, 38, 33]
SHELF_COLS = 10
SHELF_W, SHELF_H = 220, 311

DEPT_ORDER = {"S&H": 0, "ECE": 1, "CSE": 2}


def slugify(s: str) -> str:
    s = s.lower().replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def git_revised_dates() -> dict[str, str]:
    """Last add/modify date per note PDF, across the pre-flatten path too (one git call)."""
    prefixes = ("public/notes/", "hitesh-engineering/public/notes/")
    try:
        out = subprocess.run(
            ["git", "log", "--diff-filter=AM", "--name-only", "--format=@%cs", "--", *prefixes],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout
    except (subprocess.CalledProcessError, FileNotFoundError):
        return {}
    dates: dict[str, str] = {}
    current = ""
    for line in out.splitlines():
        if line.startswith("@"):
            current = line[1:]
        elif line:
            for p in prefixes:
                if line.startswith(p):
                    dates.setdefault(line[len(p):], current)  # log is newest first
    return dates


REVISED: dict[str, str] = {}


def revised(pdf_rel: str, src_file: Path) -> str:
    """Last commit date of the deployed copy in public/notes, else file mtime."""
    return REVISED.get(pdf_rel) or dt.date.fromtimestamp(src_file.stat().st_mtime).isoformat()


def render_page(doc: pymupdf.Document, i: int, dest: Path) -> None:
    if dest.exists():
        return
    page = doc[i]
    scale = min(PAGE_W / page.rect.width, PAGE_H / page.rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
    img = pyvips.Image.new_from_memory(pix.samples, pix.width, pix.height, pix.n, "uchar")
    if img.bands == 1:
        img = img.colourspace("srgb")
    left = (PAGE_W - img.width) // 2
    top = (PAGE_H - img.height) // 2
    img = img.embed(left, top, PAGE_W, PAGE_H, extend="background", background=[255, 255, 255])
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.jpegsave(str(dest), Q=86, strip=True)


def label(text: str, dpi: int) -> pyvips.Image:
    mask = pyvips.Image.text(html.escape(text), dpi=dpi, font="Georgia")
    ink = mask.new_from_image(INK).copy(interpretation="srgb")
    return ink.bandjoin(mask)


def paste(canvas: pyvips.Image, img: pyvips.Image, x: int, y: int) -> pyvips.Image:
    if img.bands == 4:
        return canvas.composite2(img, "over", x=x, y=y).extract_band(0, n=3)
    return canvas.insert(img, x, y)


def build_subject_desk(slug: str, title: str, files: list[dict]) -> dict:
    """One big image: subject title, then one block of rows per unit (PDF)."""
    title_img = label(title, dpi=2600)
    width = GAP + COLS * (PAGE_W + GAP)
    y = GAP + title_img.height + GAP
    rows = []
    for f in files:
        unit_img = label(f["unit"], dpi=760)
        n = f["pages"]
        nrows = math.ceil(n / COLS)
        rows.append((f, unit_img, y))
        y += unit_img.height + GAP // 2 + nrows * (PAGE_H + GAP) + GAP
    height = y
    canvas = pyvips.Image.black(width, height, bands=3).new_from_image(DESK_BG).copy(interpretation="srgb")
    canvas = paste(canvas, title_img, GAP, GAP)
    items = []
    for f, unit_img, top in rows:
        canvas = paste(canvas, unit_img, GAP, top)
        py = top + unit_img.height + GAP // 2
        for i in range(f["pages"]):
            r, c = divmod(i, COLS)
            x = GAP + c * (PAGE_W + GAP)
            yy = py + r * (PAGE_H + GAP)
            page = pyvips.Image.new_from_file(str(CACHE / slug / f["stem"] / f"p{i + 1:03d}.jpg"))
            canvas = canvas.insert(page, x, yy)
            items.append({"file": f["stem"], "page": i + 1, "x": x, "y": yy, "w": PAGE_W, "h": PAGE_H})
    return {"image": canvas, "layout": {"width": width, "height": height, "items": items}}


def build_shelf_desk(subjects: list[dict]) -> dict:
    """All subjects on one desk: one row of subject blocks per year."""
    blocks = []
    for s in subjects:
        thumbs = [(f["stem"], i + 1) for f in s["files"] for i in range(f["pages"])]
        lab = label(s["subject"], dpi=1100)
        nrows = math.ceil(len(thumbs) / SHELF_COLS)
        bw = SHELF_COLS * (SHELF_W + 20)
        bh = lab.height + 40 + nrows * (SHELF_H + 20)
        blocks.append({"s": s, "lab": lab, "thumbs": thumbs, "w": bw, "h": bh})
    years = sorted({b["s"]["year"] for b in blocks})
    layout_rows, y, width = [], GAP, 0
    for yr in years:
        row = [b for b in blocks if b["s"]["year"] == yr]
        x = GAP
        for b in row:
            b["x"], b["y"] = x, y
            x += b["w"] + GAP * 3
        width = max(width, x)
        y += max(b["h"] for b in row) + GAP * 3
        layout_rows.append(row)
    height = y
    canvas = pyvips.Image.black(width, height, bands=3).new_from_image(DESK_BG).copy(interpretation="srgb")
    items = []
    for row in layout_rows:
        for b in row:
            s = b["s"]
            canvas = paste(canvas, b["lab"], b["x"], b["y"])
            top = b["y"] + b["lab"].height + 40
            for k, (stem, page) in enumerate(b["thumbs"]):
                r, c = divmod(k, SHELF_COLS)
                x = b["x"] + c * (SHELF_W + 20)
                yy = top + r * (SHELF_H + 20)
                t = pyvips.Image.new_from_file(str(DEV / "thumbs" / s["slug"] / stem / f"p{page:03d}.jpg"))
                canvas = canvas.insert(t, x, yy)
                items.append({"subject": s["slug"], "file": stem, "page": page, "x": x, "y": yy, "w": SHELF_W, "h": SHELF_H})
    return {"image": canvas, "layout": {"width": width, "height": height, "items": items}}


def save_desk(name: str, desk: dict) -> None:
    out = DEV / "desk"
    out.mkdir(parents=True, exist_ok=True)
    for old in (out / f"{name}.dzi", out / f"{name}_files"):
        if old.is_dir():
            shutil.rmtree(old)
        elif old.exists():
            old.unlink()
    desk["image"].dzsave(str(out / name), suffix=".jpg[Q=72,strip]", overlap=1, tile_size=512)
    (out / f"{name}.json").write_text(json.dumps(desk["layout"]))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="rebuild one subject slug")
    ap.add_argument("--no-tiles", action="store_true", help="skip page renders and deep-zoom tiles")
    args = ap.parse_args()
    REVISED.update(git_revised_dates())

    seed = {e["path"]: e for e in yaml.safe_load(SEED.read_text(encoding="utf-8"))["files"]}
    previous = {}
    if OUT_YAML.exists():
        for s in (yaml.safe_load(OUT_YAML.read_text(encoding="utf-8")) or {}).get("subjects", []):
            previous[s["slug"]] = s

    pdfs = sorted(p for p in SRC.rglob("*.pdf"))
    by_subject: dict[str, dict] = {}
    for p in pdfs:
        rel = p.relative_to(SRC).as_posix()
        meta = seed.get(rel)
        if meta is None:
            print(f"skip (no seed entry): {rel}", file=sys.stderr)
            continue
        slug = slugify(meta["subject"])
        s = by_subject.setdefault(slug, {
            "slug": slug, "subject": meta["subject"], "year": int(meta["year"]),
            "semester": meta.get("semester"), "department": meta["department"], "files": [],
        })
        doc = pymupdf.open(p)
        stem = p.stem
        prev_files = {f["stem"]: f for f in previous.get(slug, {}).get("files", [])}
        prev = prev_files.get(stem, {})
        s["files"].append({
            "stem": stem,
            "unit": prev.get("unit") or meta["title"],
            "pdf": rel,
            "pages": doc.page_count,
            "revised": revised(rel, p),
            "topics": prev.get("topics", []),
        })
        doc.close()

    subjects = []
    for slug, s in by_subject.items():
        prev = previous.get(slug, {})
        if prev.get("semester") is not None:
            s["semester"] = prev["semester"]
        s["files"].sort(key=lambda f: f["pdf"])
        s["pages"] = sum(f["pages"] for f in s["files"])
        s["cover"] = f"notes-covers/{slug}.jpg"
        s["desk"] = f"desk/{slug}.dzi"
        subjects.append(s)
    subjects.sort(key=lambda s: (s["year"], s["semester"] or 9, DEPT_ORDER.get(s["department"], 9), s["subject"]))

    COVERS.mkdir(parents=True, exist_ok=True)
    for s in subjects:
        if args.only and s["slug"] != args.only:
            continue
        first = s["files"][0]
        doc = pymupdf.open(SRC / first["pdf"])
        page = doc[0]
        pix = page.get_pixmap(matrix=pymupdf.Matrix(COVER_W / page.rect.width, COVER_W / page.rect.width), alpha=False)
        pyvips.Image.new_from_memory(pix.samples, pix.width, pix.height, pix.n, "uchar").jpegsave(
            str(COVERS / f"{s['slug']}.jpg"), Q=78, strip=True)
        if args.no_tiles:
            continue
        for f in s["files"]:
            doc = pymupdf.open(SRC / f["pdf"])
            for i in range(f["pages"]):
                full = CACHE / s["slug"] / f["stem"] / f"p{i + 1:03d}.jpg"
                render_page(doc, i, full)
                thumb = DEV / "thumbs" / s["slug"] / f["stem"] / f"p{i + 1:03d}.jpg"
                if not thumb.exists():
                    thumb.parent.mkdir(parents=True, exist_ok=True)
                    pyvips.Image.thumbnail(str(full), THUMB_W).jpegsave(str(thumb), Q=75, strip=True)
            doc.close()
        save_desk(s["slug"], build_subject_desk(s["slug"], s["subject"], s["files"]))
        print(f"desk: {s['slug']} ({s['pages']} pages)")

    if not args.no_tiles and not args.only:
        save_desk("shelf", build_shelf_desk(subjects))
        print("desk: shelf")

    OUT_YAML.parent.mkdir(parents=True, exist_ok=True)
    header = (
        "# Generated by scripts/notes/build.py from private/notes/.\n"
        "# Safe to hand-edit: subjects[].semester, files[].unit, files[].topics\n"
        "# (topics: - name: Fourier series\n#            page: 22). Rebuilds keep those edits.\n"
    )
    OUT_YAML.write_text(header + yaml.safe_dump({"subjects": subjects}, sort_keys=False, allow_unicode=True), encoding="utf-8")
    print(f"{len(subjects)} subjects, {sum(s['pages'] for s in subjects)} pages -> {OUT_YAML.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
