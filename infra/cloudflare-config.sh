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
#   ...or store it once at ~/.config/cloudflare/robelfekadu.env (chmod 600) and
#      the script will source it automatically. Never keep it inside the repo.
#   ./infra/cloudflare-config.sh           # dry run — prints the plan, changes nothing
#   ./infra/cloudflare-config.sh --apply   # backs up current config, then applies
#   ./infra/cloudflare-config.sh --apply --dns    # also add the www -> apex redirect
#   ./infra/cloudflare-config.sh --apply --purge  # also purge the cache
#   ./infra/cloudflare-config.sh --apply --hsts   # HSTS + includeSubDomains
#   ./infra/cloudflare-config.sh --apply --hsts-preload   # ...and preload (see warning)
#
# Token needs these permissions on the robelfekadu.com zone:
#   Zone / Zone           / Read
#   Zone / Cache Rules    / Edit
#   Zone / Transform Rules/ Edit
#   Zone / Zone Settings  / Edit
#   Zone / Cache Purge    / Purge      (only for --purge)
#   Zone / DNS            / Edit       (only for --dns)
#   Zone / Single Redirect/ Edit       (optional; upgrades the www 307 to an
#                                       edge 301 - see the --dns block)
# Create at: dash.cloudflare.com -> My Profile -> API Tokens -> Create Token
# ---------------------------------------------------------------------------
set -euo pipefail

ZONE_NAME="robelfekadu.com"
API="https://api.cloudflare.com/client/v4"
BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.cf-backups"
APPLY=0; PURGE=0; DNS=0; HSTS=0; HSTS_PRELOAD=0

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --purge) PURGE=1 ;;
    --dns)   DNS=1 ;;
    --hsts)  HSTS=1 ;;
    --hsts-preload) HSTS=1; HSTS_PRELOAD=1 ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
    *) echo "unknown flag: $arg" >&2; exit 2 ;;
  esac
done

# Token may come from the environment, or from a local file outside the repo.
TOKEN_FILE="${CLOUDFLARE_TOKEN_FILE:-$HOME/.config/cloudflare/robelfekadu.env}"
if [[ -z "${CLOUDFLARE_API_TOKEN:-}" && -r "$TOKEN_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$TOKEN_FILE"
fi
: "${CLOUDFLARE_API_TOKEN:?no token. export CLOUDFLARE_API_TOKEN, or write it to $TOKEN_FILE}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$REPO_ROOT/infra/csp.sh"
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
      "description": "Resume - short TTL so a redeployed PDF goes live quickly",
      "expression": "(http.request.uri.path eq \"/resume.pdf\")",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl":    { "mode": "override_origin", "default": 300 },
        "browser_ttl": { "mode": "override_origin", "default": 300 }
      }
    },
    {
      "description": "Unhashed root static assets - short TTL so updates propagate",
      "expression": "(http.request.uri.path in {\"/favicon.svg\" \"/robots.txt\" \"/sitemap.xml\" \"/robel-fekadu.jpg\" \"/avatar.jpg\" \"/og-card.jpg\"})",
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
    },
    {
      "description": "Hashed assets are immutable, not merely long-lived",
      "expression": "(starts_with(http.request.uri.path, \"/assets/\"))",
      "action": "rewrite",
      "action_parameters": {
        "headers": {
          "Cache-Control": { "operation": "set", "value": "public, max-age=31536000, immutable" }
        }
      }
    }
  ]
}
JSON

# CSP lives in HEADER_RULES rather than behind a flag, because the header-phase
# PUT below is wholesale - a rule that is not in here gets dropped on every run.
HEADER_RULES="$(jq -n --argjson base "$HEADER_RULES" --arg csp "$CSP_VALUE" \
  '$base | .rules += [{
     description: "Content-Security-Policy",
     expression: "true",
     action: "rewrite",
     action_parameters: { headers: { "Content-Security-Policy": { operation: "set", value: $csp } } }
   }]')"

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
  jq -r '.rules[] | "   - \(.description):", (.action_parameters.headers | to_entries[] | "       \(.key): \(.value.operation) \(.value.value // "")")' <<<"$HEADER_RULES"
  echo
  echo "   existing rules in this phase:"
  cf GET "/zones/$ZONE_ID/rulesets/phases/http_response_headers_transform/entrypoint" \
    | jq -r '(.result.rules // []) | if length == 0 then "     (none)" else .[] | "     - \(.description // .expression)" end'
  echo
  echo "4) Content-Security-Policy (applied as part of --apply):"
  echo "$CSP_VALUE" | fold -w 92 -s | sed 's/^/     /'
  echo "   Rocket Loader is turned off too - a hash-based CSP requires it."
  echo "   current rocket_loader: $(jq -r '.result.value' <<<"$(cf GET "/zones/$ZONE_ID/settings/rocket_loader")")"
  echo
  echo "5) HSTS (pass --hsts, or --hsts-preload):"
  cf GET "/zones/$ZONE_ID/settings/security_header" \
    | jq -r '"     current: " + (.result.value.strict_transport_security | tostring)'
  echo
  echo "NOT touched by this script (decide separately):"
  echo "   - the www CNAME + redirect (pass --dns; needs Zone/DNS/Edit on the token)"
  echo "   - the dpdns.org 301 (that host is not in this zone; the canonical tag"
  echo "     already points search engines at the .com)"
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

echo "→ verifying the CSP inline-script hash still matches index.html"
"$REPO_ROOT/infra/verify-csp-hash.sh"

# Rocket Loader injects its own inline scripts, and a CSP hash and
# 'unsafe-inline' are mutually exclusive - browsers drop 'unsafe-inline' once a
# hash is present. So Rocket Loader has to be off for the CSP to hold.
echo "→ Rocket Loader off (incompatible with a hash-based CSP)"
R="$(cf PATCH "/zones/$ZONE_ID/settings/rocket_loader" '{"value":"off"}')"
check "$R" "rocket_loader off"
echo "  ✓"

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

if [[ $HSTS -eq 1 ]]; then
  if [[ $HSTS_PRELOAD -eq 1 ]]; then
    cat <<'WARN'
  ! preload is effectively irreversible: once robelfekadu.com is baked into the
    browser preload lists, every subdomain must serve valid HTTPS for as long as
    those lists ship. Removal takes months. Only proceed if you are sure no
    subdomain will ever need plain HTTP.
WARN
  fi
  echo "→ HSTS (max-age 2y, includeSubDomains=$HSTS, preload=$HSTS_PRELOAD)"
  R="$(cf PATCH "/zones/$ZONE_ID/settings/security_header" "$(jq -n \
    --argjson preload "$([[ $HSTS_PRELOAD -eq 1 ]] && echo true || echo false)" \
    '{value: {strict_transport_security: {
        enabled: true, max_age: 63072000, include_subdomains: true,
        preload: $preload, nosniff: true }}}')")"
  check "$R" "HSTS"
  echo "  ✓"
fi

if [[ $DNS -eq 1 ]]; then
  echo "→ www.$ZONE_NAME -> apex"
  EXISTING="$(cf GET "/zones/$ZONE_ID/dns_records?name=www.$ZONE_NAME")"
  if [[ "$(jq -r '.result | length' <<<"$EXISTING")" == "0" ]]; then
    R="$(cf POST "/zones/$ZONE_ID/dns_records" "$(jq -n --arg n "www.$ZONE_NAME" --arg c "$ZONE_NAME" \
      '{type:"CNAME", name:$n, content:$c, proxied:true, ttl:1, comment:"www -> apex, redirected at the edge"}')")"
    check "$R" "www CNAME"
    echo "  ✓ CNAME created"
  else
    echo "  · CNAME already exists, leaving it alone"
  fi

  # A true 301 at Cloudflare's edge, so www never reaches the origin. This uses
  # the http_request_dynamic_redirect phase, which needs its own permission
  # group (Zone / Single Redirect / Edit) - Transform Rules / Edit is NOT enough.
  #
  # Non-fatal on purpose: the CNAME above is the part that matters. With it in
  # place Vercel already answers www with a 307 to the apex, so the site works
  # either way; this rule only upgrades that to an edge 301.
  R="$(cf PUT "/zones/$ZONE_ID/rulesets/phases/http_request_dynamic_redirect/entrypoint" '{
    "rules": [
      {
        "description": "www -> apex, 301",
        "expression": "(http.host eq \"www.'"$ZONE_NAME"'\")",
        "action": "redirect",
        "action_parameters": {
          "from_value": {
            "status_code": 301,
            "target_url": { "expression": "concat(\"https://'"$ZONE_NAME"'\", http.request.uri.path)" },
            "preserve_query_string": true
          }
        }
      }
    ]
  }')"
  if [[ "$(jq -r '.success' <<<"$R")" == "true" ]]; then
    echo "  ✓ edge 301 redirect rule active"
  else
    echo "  · edge 301 rule skipped: $(jq -r '.errors[0].message // "unknown"' <<<"$R")"
    echo "    Add 'Zone / Single Redirect / Edit' to the token to enable it."
    echo "    Not fatal - Vercel already 307s www to the apex via the CNAME above."
  fi
fi

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
