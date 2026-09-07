#!/usr/bin/env bash
# Fails if index.html's inline script no longer matches the hash in csp.sh.
# Without this, editing the theme guard silently breaks it under CSP.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
# shellcheck source=/dev/null
source infra/csp.sh

ACTUAL="sha256-$(python3 - <<'PY'
import re, hashlib, base64, io
s = io.open('index.html', encoding='utf-8').read()
m = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S)
if len(m) != 1:
    raise SystemExit(f'expected exactly 1 inline script in index.html, found {len(m)}')
print(base64.b64encode(hashlib.sha256(m[0].encode('utf-8')).digest()).decode())
PY
)"

if [[ "$ACTUAL" != "$INLINE_THEME_SCRIPT_HASH" ]]; then
  echo "✗ CSP hash mismatch for the inline theme script in index.html" >&2
  echo "    csp.sh has : $INLINE_THEME_SCRIPT_HASH" >&2
  echo "    actual     : $ACTUAL" >&2
  echo "  Update INLINE_THEME_SCRIPT_HASH in infra/csp.sh, then re-run" >&2
  echo "  ./infra/cloudflare-config.sh --apply --csp" >&2
  exit 1
fi
echo "✓ CSP inline-script hash matches ($ACTUAL)"
