#!/usr/bin/env bash
# Bootstrap local Firebase RC admin panel (store review + store updater).
# Usage: ./ai_toolkit/setup/scripts/bootstrap-rc-admin.sh [--copy-template]
#
# Run from repository root. Requires Node.js 18+.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TEMPLATE_DIR="$ROOT/ai_toolkit/templates/tooling/rc-admin"
TARGET_DIR="$ROOT/tool/firebase/rc-admin"
COPY_TEMPLATE=false

for arg in "$@"; do
  case "$arg" in
    --copy-template) COPY_TEMPLATE=true ;;
    -h|--help)
      echo "Usage: $0 [--copy-template]"
      echo "  --copy-template  Copy scaffold from ai_toolkit template even if target exists"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

if [[ "$COPY_TEMPLATE" == true ]] || [[ ! -f "$TARGET_DIR/server.js" ]]; then
  if [[ ! -d "$TEMPLATE_DIR" ]]; then
    echo "Template not found: $TEMPLATE_DIR" >&2
    exit 1
  fi
  mkdir -p "$TARGET_DIR"
  rsync -a --exclude node_modules --exclude .env "$TEMPLATE_DIR/" "$TARGET_DIR/"
  echo "Copied RC admin scaffold to tool/firebase/rc-admin/"
fi

if [[ ! -f "$TARGET_DIR/.env" ]]; then
  if [[ -f "$TARGET_DIR/.env.example" ]]; then
    cp "$TARGET_DIR/.env.example" "$TARGET_DIR/.env"
    echo "Created .env from .env.example — edit FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS"
  else
    echo "Missing .env and .env.example in $TARGET_DIR" >&2
    exit 1
  fi
fi

cd "$TARGET_DIR"
npm install

# shellcheck disable=SC1091
set -a
source .env 2>/dev/null || true
set +a

PORT="${PORT:-3847}"

if [[ -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]]; then
  echo "Warning: GOOGLE_APPLICATION_CREDENTIALS is not set in .env"
elif [[ ! -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]]; then
  echo "Warning: service account file not found: ${GOOGLE_APPLICATION_CREDENTIALS}"
fi

echo ""
echo "RC admin dependencies installed."
echo "Start with: make rc-admin"
echo "Or: cd tool/firebase/rc-admin && node server.js"
echo "URL: http://127.0.0.1:${PORT}"
