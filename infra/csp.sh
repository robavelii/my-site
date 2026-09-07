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
set -euo pipefail

# Recomputed from index.html by verify-csp-hash.sh
INLINE_THEME_SCRIPT_HASH='sha256-m6xedvQB1dcQ2jYg+8QU/H6cVusVLTp1rNa0LoE6IUc='

read -r -d '' CSP_VALUE <<POLICY || true
default-src 'self'; script-src 'self' https://static.cloudflareinsights.com '${INLINE_THEME_SCRIPT_HASH}'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://static.cloudflareinsights.com; manifest-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests
POLICY

# collapse to a single line
CSP_VALUE="$(tr -d '\n' <<<"$CSP_VALUE" | sed 's/  */ /g; s/^ //; s/ $//')"
export CSP_VALUE INLINE_THEME_SCRIPT_HASH
