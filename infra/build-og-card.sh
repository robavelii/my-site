#!/usr/bin/env bash
# Renders the 1200x630 Open Graph card from og-card.template.html.
# Run after changing the template or the source photo:
#   ./infra/build-og-card.sh
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

command -v google-chrome >/dev/null || { echo "google-chrome not found" >&2; exit 1; }
OUT="$(mktemp -d)/card.png"

google-chrome --headless --disable-gpu --hide-scrollbars \
  --allow-file-access-from-files \
  --screenshot="$OUT" --window-size=1200,630 --virtual-time-budget=6000 \
  "file://$PWD/og-card.template.html" >/dev/null 2>&1

python3 - "$OUT" <<'PY'
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
assert im.size == (1200, 630), f'expected 1200x630, got {im.size}'
im.save('../public/og-card.jpg', 'JPEG', quality=88, optimize=True, progressive=True)
print('wrote public/og-card.jpg', im.size)
PY
