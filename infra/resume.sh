#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Replace the live résumé without rebuilding or redeploying the site.
#
#   ./infra/resume.sh ~/Documents/personal/Resume/whatever.pdf   # publish it
#   ./infra/resume.sh --status                                   # what's live
#
# How it works: the PDF lives in a Vercel Blob store, and vercel.json rewrites
# /resume.pdf to it. A rewrite proxies rather than redirects, so the browser
# still sees a same-origin /resume.pdf -- which matters, because the <a download>
# attribute is ignored cross-origin and the CSP is scoped to 'self'.
#
# Uploading overwrites the same pathname, so the URL never changes and no
# deploy is involved. Cache-control is 5 minutes, so a new version is live
# within that.
#
# ONE-TIME SETUP (needed once, then never again):
#   1. Vercel dashboard -> Storage -> Create Database -> Blob.
#      Connect it to the my-website project.
#   2. From this directory:  vercel link      (pick the my-website project)
#   3. Then this script works with no further arguments or tokens.
#
# The committed public/resume.pdf stays in the repo as a fallback: if the
# rewrite is ever removed, the file is still there and /resume.pdf still works.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

BLOB_PATHNAME='resume.pdf'
LIVE_URL='https://robelfekadu.com/resume.pdf'
CACHE_SECONDS=300

command -v vercel >/dev/null || { echo "vercel CLI not found: npm i -g vercel" >&2; exit 1; }

blob_status() {
  echo "→ blob store contents"
  if ! vercel blob list --non-interactive 2>&1 | grep -E "$BLOB_PATHNAME|pathname|No Vercel Blob"; then
    echo "  (nothing, or no store connected - see ONE-TIME SETUP in this file)"
  fi
  echo
  echo "→ what $LIVE_URL actually serves"
  curl -sSI --max-time 20 "$LIVE_URL" \
    | grep -iE '^HTTP|^content-type|^content-length|^cache-control|^x-vercel|^age' \
    | sed 's/^/  /'
}

if [[ "${1:-}" == "--status" ]]; then
  blob_status
  exit 0
fi

PDF="${1:-}"
if [[ -z "$PDF" ]]; then
  sed -n '3,10p' "$0" | sed 's/^# \{0,1\}//'
  exit 2
fi
[[ -r "$PDF" ]] || { echo "cannot read: $PDF" >&2; exit 1; }

# Refuse anything that isn't actually a PDF - a broken résumé link is worse
# than a stale one.
python3 - "$PDF" <<'PY'
import sys
p = sys.argv[1]
d = open(p, 'rb').read()
if d[:5] != b'%PDF-':
    raise SystemExit(f'✗ {p} is not a PDF (no %PDF- header)')
if b'%%EOF' not in d[-4096:]:
    raise SystemExit(f'✗ {p} looks truncated (no %%EOF near the end)')
pages = d.count(b'/Type /Page') + d.count(b'/Type/Page')
print(f'✓ {p}: valid PDF, ~{pages} pages, {len(d):,} bytes')
PY

# Fail fast with instructions rather than hanging on an interactive prompt
# when no store is connected yet.
echo "→ checking blob credentials"
if ! timeout 45 vercel blob list --non-interactive >/dev/null 2>&1; then
  cat >&2 <<'SETUP'
✗ No Vercel Blob store is reachable from this directory, so there is nowhere
  to upload to. One-time setup:

    1. Vercel dashboard -> Storage -> Create Database -> Blob
       Connect the store to the "my-website" project.
    2. From this directory:  vercel link     (choose my-website)
    3. Re-run this script.

  Until then the résumé is served from the committed public/resume.pdf, so
  updating it means editing that file and letting Vercel redeploy.
SETUP
  exit 1
fi
echo "  ✓"

echo "→ uploading to the blob store as '$BLOB_PATHNAME'"
vercel blob put "$PDF" \
  --pathname "$BLOB_PATHNAME" \
  --access public \
  --add-random-suffix false \
  --allow-overwrite true \
  --content-type application/pdf \
  --cache-control-max-age "$CACHE_SECONDS" \
  --non-interactive

echo
echo "→ verifying the live URL (may take up to ${CACHE_SECONDS}s to flush)"
sleep 3
LIVE_LEN="$(curl -sSI --max-time 25 "$LIVE_URL" | awk 'tolower($1)=="content-length:"{print $2}' | tr -d '\r')"
LOCAL_LEN="$(stat -c %s "$PDF")"
echo "  local:  $LOCAL_LEN bytes"
echo "  live:   ${LIVE_LEN:-unknown} bytes"
if [[ "$LIVE_LEN" == "$LOCAL_LEN" ]]; then
  echo "  ✓ live résumé matches the file you just uploaded"
else
  echo "  · not matching yet - either the cache has not flushed, or the"
  echo "    vercel.json rewrite for /resume.pdf is not in place yet."
  echo "    Re-check with: ./infra/resume.sh --status"
fi
