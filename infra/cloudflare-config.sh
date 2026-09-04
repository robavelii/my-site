#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Cloudflare configuration for robelfekadu.com
#
# Cloudflare is the authority for caching and response headers on this site.
# Vercel is the origin only — deliberately no `headers` block in vercel.json,
# so there is exactly one place these rules live: this file.
#
# Usage:
#   export CLOUDFLARE_API_TOKEN=...        # you set this; the script only reads it
#   ./infra/cloudflare-config.sh           # dry run — prints the plan, changes nothing
#   ./infra/cloudflare-config.sh --apply   # backs up current config, then applies
#
# Token needs these permissions on the robelfekadu.com zone:
#   Zone / Zone           / Read
#   Zone / Cache Rules    / Edit
#   Zone / Transform Rules/ Edit
#   Zone / Zone Settings  / Edit
#   Zone / Cache Purge    / Purge      (only for --purge)
# Create at: dash.cloudflare.com -> My Profile -> API Tokens -> Create Token
# ---------------------------------------------------------------------------
set -euo pipefail

ZONE_NAME="robelfekadu.com"
API="https://api.cloudflare.com/client/v4"
BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.cf-backups"
APPLY=0; PURGE=0

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --purge) PURGE=1 ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

: "${CLOUDFLARE_API_TOKEN:?set CLOUDFLARE_API_TOKEN first (see header)}"
command -v jq >/dev/null || { echo "jq is required" >&2; exit 1; }

cf() {  # cf <METHOD> <PATH> [JSON_BODY]
  local method="$1" path="$2" body="${3:-}"
  if [[ -n "$body" ]]; then
    curl -sS -X "$method" "$API$path" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" --data "$body"
  else
    curl -sS -X "$method" "$API$path" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
  fi
}

check() {  # fail loudly on API errors instead of silently continuing
  local resp="$1" what="$2"
  if [[ "$(jq -r '.success' <<<"$resp")" != "true" ]]; then
    echo "  ✗ $what failed:" >&2
    jq -r '.errors[]? | "      [\(.code)] \(.message)"' <<<"$resp" >&2
    exit 1
  fi
}

# ---------------------------------------------------------------------------
# Resolve zone
# ---------------------------------------------------------------------------
echo "→ resolving zone $ZONE_NAME"
ZRESP="$(cf GET "/zones?name=$ZONE_NAME")"
check "$ZRESP" "zone lookup"
ZONE_ID="$(jq -r '.result[0].id' <<<"$ZRESP")"
[[ "$ZONE_ID" != "null" && -n "$ZONE_ID" ]] || { echo "  ✗ zone not found — is the token scoped to this zone?" >&2; exit 1; }
echo "  zone id: $ZONE_ID"

# ---------------------------------------------------------------------------
# Rule definitions
# ---------------------------------------------------------------------------

# Cache rules. Order matters: first match wins.
#
#  1. /assets/* are content-hashed by Vite (index-<hash>.js). The filename
#     changes whenever the content does, so they can never go stale ->
#     safe to pin for a year in both edge and browser cache.
#  2. Root static files are NOT hashed (favicon.svg, resume.pdf, sitemap.xml...).
#     A replaced resume must actually propagate, so these get a modest TTL.
#  3. The HTML document is left to the origin. Vercel already edge-serves it
#     (x-vercel-cache: HIT) and leaving it uncached at Cloudflare means a
#     deploy is live immediately with no purge step. Revisit only if you want
#     Cloudflare holding HTML too — that needs a purge-on-deploy hook.
read -r -d '' CACHE_RULES <<'JSON' || true
{
  "rules": [
    {
      "description": "Immutable hashed build assets - 1y edge + browser",
      "expression": "(starts_with(http.request.uri.path, \"/assets/\"))",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl":    { "mode": "override_origin", "default": 31536000 },
        "browser_ttl": { "mode": "override_origin", "default": 31536000 }
      }
    },
    {
      "description": "Unhashed root static assets - short TTL so updates propagate",
      "expression": "(http.request.uri.path in {\"/favicon.svg\" \"/robots.txt\" \"/sitemap.xml\" \"/resume.pdf\" \"/robel-fekadu.jpg\"})",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl":    { "mode": "override_origin", "default": 86400 },
        "browser_ttl": { "mode": "override_origin", "default": 3600 }
      }
    }
  ]
}
JSON

# Response headers. Deliberately excluded, with reasons:
#   - Strict-Transport-Security: already sent by Cloudflare (max-age=63072000).
#     Adding includeSubDomains/preload is a long-lived commitment that would
#     break any subdomain not on HTTPS. Set it in SSL/TLS -> Edge Certificates
#     once you've confirmed every subdomain. Decide, don't default.
#   - Content-Security-Policy: needs to allow Google Fonts and the Vercel
#     analytics scripts. Guessing it here would break the site silently.
#     Worth doing as its own task with report-only first.
read -r -d '' HEADER_RULES <<'JSON' || true
{
  "rules": [
    {
      "description": "Baseline security response headers",
      "expression": "true",
      "action": "rewrite",
      "action_parameters": {
        "headers": {
          "X-Content-Type-Options": { "operation": "set", "value": "nosniff" },
          "Referrer-Policy":        { "operation": "set", "value": "strict-origin-when-cross-origin" },
          "X-Frame-Options":        { "operation": "set", "value": "DENY" },
          "Permissions-Policy":     { "operation": "set", "value": "geolocation=(), camera=(), microphone=(), payment=(), usb=()" },
          "Access-Control-Allow-Origin": { "operation": "remove" }
        }
      }
    }
  ]
}
JSON

# ---------------------------------------------------------------------------
# Dry run
# ---------------------------------------------------------------------------
if [[ $APPLY -eq 0 ]]; then
  echo
  echo "=== DRY RUN — nothing will be changed. Re-run with --apply to commit. ==="
  echo
  echo "1) Zone setting  browser_cache_ttl -> 0 (\"Respect Existing Headers\")"
  echo "   current: $(jq -r '.result.value' <<<"$(cf GET "/zones/$ZONE_ID/settings/browser_cache_ttl")")"
  echo "   This is what currently caps hashed assets at 14400s. Setting it to"
  echo "   \"respect\" hands per-path control to the cache rules below."
  echo
  echo "2) Cache rules (phase http_request_cache_settings), replacing entrypoint:"
  jq -r '.rules[] | "   - \(.description)\n     when: \(.expression)"' <<<"$CACHE_RULES"
  echo
  echo "   existing rules in this phase:"
  cf GET "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" \
    | jq -r '(.result.rules // []) | if length == 0 then "     (none)" else .[] | "     - \(.description // .expression)" end'
  echo
  echo "3) Response header rules (phase http_response_headers_transform):"
  jq -r '.rules[0].action_parameters.headers | to_entries[] | "   - \(.key): \(.value.operation) \(.value.value // "")"' <<<"$HEADER_RULES"
  echo
  echo "   existing rules in this phase:"
  cf GET "/zones/$ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" \
    | jq -r '(.result.rules // []) | if length == 0 then "     (none)" else .[] | "     - \(.description // .expression)" end'
  echo
  echo "NOT touched by this script (decide separately):"
  echo "   - HSTS includeSubDomains / preload"
  echo "   - Content-Security-Policy"
  echo "   - the www CNAME and the dpdns.org redirect"
  exit 0
fi

# ---------------------------------------------------------------------------
# Apply
# ---------------------------------------------------------------------------
mkdir -p "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
echo "→ backing up current config to infra/.cf-backups/"
cf GET "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" \
  > "$BACKUP_DIR/cache-rules-$STAMP.json"
cf GET "/zones/$ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" \
  > "$BACKUP_DIR/header-rules-$STAMP.json"
cf GET "/zones/$ZONE_ID/settings/browser_cache_ttl" \
  > "$BACKUP_DIR/browser-cache-ttl-$STAMP.json"
echo "  saved 3 files (stamp $STAMP)"

echo "→ browser_cache_ttl -> respect existing headers"
R="$(cf PATCH "/zones/$ZONE_ID/settings/browser_cache_ttl" '{"value":0}')"
check "$R" "browser_cache_ttl"
echo "  ✓"

echo "→ cache rules"
R="$(cf PUT "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" "$CACHE_RULES")"
check "$R" "cache rules"
echo "  ✓ $(jq -r '.result.rules | length' <<<"$R") rule(s) active"

echo "→ response header rules"
R="$(cf PUT "/zones/$ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" "$HEADER_RULES")"
check "$R" "header rules"
echo "  ✓ $(jq -r '.result.rules | length' <<<"$R") rule(s) active"

if [[ $PURGE -eq 1 ]]; then
  echo "→ purging everything"
  R="$(cf POST "/zones/$ZONE_ID/purge_cache" '{"purge_everything":true}')"
  check "$R" "purge"
  echo "  ✓"
fi

cat <<'DONE'

Applied. Verify with:
  curl -sSI https://robelfekadu.com/ | grep -iE 'referrer|x-content|x-frame|permissions|access-control'
  ASSET=$(curl -sS https://robelfekadu.com/ | grep -o '/assets/[^"]*\.js' | head -1)
  curl -sSI "https://robelfekadu.com$ASSET" | grep -i 'cache-control\|cf-cache-status'

Expect: cache-control: public, max-age=31536000, immutable
(first request may show cf-cache-status: MISS — fetch it twice)

To roll back, PUT the matching file from infra/.cf-backups/ back to the same
phase endpoint, and PATCH browser_cache_ttl to its saved value.
DONE
