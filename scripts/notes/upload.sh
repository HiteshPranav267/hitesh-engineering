#!/usr/bin/env bash
# Upload note PDFs, thumbnails and deep-zoom tiles to Cloudflare R2.
# Run only when you mean to — nothing calls this automatically.
#
# Prerequisites
#   1. An R2 bucket with public access (or a custom domain) and CORS allowing GET from
#      https://hiteshpranav267.github.io
#   2. An rclone remote for it, e.g. `rclone config create r2 s3 provider=Cloudflare \
#        access_key_id=... secret_access_key=... endpoint=https://<account>.r2.cloudflarestorage.com`
#
# Usage
#   scripts/notes/upload.sh <rclone-remote:bucket> [--dry-run]
#
# Afterwards set, in the GitHub Pages build (repo Variables or deploy.yml env):
#   NEXT_PUBLIC_NOTES_PDF_BASE=https://<public-r2-host>/pdf
#   NEXT_PUBLIC_NOTES_ASSETS_BASE=https://<public-r2-host>
set -euo pipefail

dest="${1:?usage: upload.sh <remote:bucket> [--dry-run]}"
shift || true
flags=(--progress --transfers 16 --checkers 32 --fast-list)
[[ "${1:-}" == "--dry-run" ]] && flags+=(--dry-run)

root="$(cd "$(dirname "$0")/../.." && pwd)"

# PDFs keep their public/notes paths so notes.yaml `pdf:` keys stay valid.
rclone copy "$root/private/notes" "$dest/pdf" --include "*.pdf" "${flags[@]}"
rclone copy "$root/public/notes-dev/thumbs" "$dest/thumbs" "${flags[@]}"
rclone copy "$root/public/notes-dev/desk" "$dest/desk" "${flags[@]}"
