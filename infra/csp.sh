#!/usr/bin/env bash
# Single source of truth for the Content-Security-Policy.
#
# The inline theme script in index.html (the FOUC guard) is allowed by SHA-256
# hash rather than 'unsafe-inline'. If that script changes, the hash must change
# with it -- infra/verify-csp-hash.sh checks this and CI runs it, so a mismatch
# fails the build instead of silently reverting the site to a theme flash.
#
# Note: a hash and 'unsafe-inline' cannot coexist -- browsers ignore
# 'unsafe-inline' once a hash is present. That is why Cloudflare Rocket Loader
# must be off: it injects its own inline scripts.
#
# KNOWN, ACCEPTED VIOLATION -- Cloudflare JS Detections
# -----------------------------------------------------
# With JS Detections on (Security -> Bots), Cloudflare injects a ~920 byte
# inline script that builds a hidden iframe to bootstrap
# /cdn-cgi/challenge-platform/.../jsd/main.js. It carries no nonce and
# Cloudflare rotates its contents, so it cannot be allow-listed by hash without
# breaking again on the next rotation.
#
# The console therefore logs one CSP violation per page load and JS Detections
# does not run. Everything else is verified working: bundle, Google Fonts,
# Vercel Analytics + Speed Insights, the Cloudflare beacon (external, so it is
# allowed), React, the theme guard and the command palette.
#
# Three ways out, in order of preference:
#   1. Suppress the injection at the origin. Cloudflare skips JSD when the
#      ORIGIN response carries Cache-Control: no-transform, so that header is
#      set on "/" in vercel.json. It has to come from Vercel, not from a
#      Cloudflare response-header rule -- those run after the injection
#      decision has already been made.
#
#      Note this is the one deliberate exception to "Cloudflare owns the
#      headers": no-transform only does anything if the origin sends it.
#
#      It costs nothing here. no-transform also disables Email Address
#      Obfuscation, but that only rewrites addresses present in the HTML, and
#      this site renders contact@ from the JS bundle -- the served HTML
#      contains zero occurrences of it. It also drops Cloudflare's own
#      analytics beacon, which is redundant next to Vercel Analytics and
#      Speed Insights.
#
#   2. Turning JS Detections off is NOT available on this plan: Cloudflare
#      enables it automatically for Bot Fight Mode customers and it cannot be
#      switched off. That is why there is no toggle in the dashboard.
#
#   3. Cloudflare's own recommendation is a per-request CSP nonce, which it
#      parses and copies onto the scripts it injects. That needs a Worker to
#      generate the nonce per response -- a static header cannot, since a
#      fixed nonce is no better than 'unsafe-inline'.
#
#   4. Do NOT add 'unsafe-inline' to make it go away -- that would also
#      re-permit every other inline script and negate the hash entirely.
set -euo pipefail

# Recomputed from index.html by verify-csp-hash.sh
INLINE_THEME_SCRIPT_HASH='sha256-m6xedvQB1dcQ2jYg+8QU/H6cVusVLTp1rNa0LoE6IUc='

read -r -d '' CSP_VALUE <<POLICY || true
default-src 'self'; script-src 'self' https://static.cloudflareinsights.com '${INLINE_THEME_SCRIPT_HASH}'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://static.cloudflareinsights.com; manifest-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
POLICY

# collapse to a single line
CSP_VALUE="$(tr -d '\n' <<<"$CSP_VALUE" | sed 's/  */ /g; s/^ //; s/ $//')"
export CSP_VALUE INLINE_THEME_SCRIPT_HASH
