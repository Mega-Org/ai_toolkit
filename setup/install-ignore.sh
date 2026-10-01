#!/bin/bash
# Copy Cursor ignore templates into the app root. Existing files are merged:
# template lines that are not already present are appended (custom lines stay).

set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
TOOLKIT_DIR="${TOOLKIT_DIR:-$PROJECT_ROOT/ai_toolkit}"
TEMPLATES_DIR="$TOOLKIT_DIR/templates/cursor-ignore"

die() { echo "❌ $*" >&2; exit 1; }

[ -d "$TEMPLATES_DIR" ] || die "templates not found: $TEMPLATES_DIR"

merge_ignore() {
    local template="$1"
    local dest="$2"
    local name="$3"

    [ -f "$template" ] || die "missing template: $template"

    if [ ! -f "$dest" ]; then
        cp "$template" "$dest"
        echo "✅ created $name"
        return 0
    fi

    local added=0
    while IFS= read -r line || [ -n "$line" ]; do
        [ -z "$line" ] && continue
        case "$line" in
            \#*) continue ;;
        esac
        if grep -Fqx -- "$line" "$dest"; then
            continue
        fi
        printf '\n%s\n' "$line" >> "$dest"
        added=$((added + 1))
    done < "$template"

    if [ "$added" -eq 0 ]; then
        echo "✅ $name already has template patterns"
    else
        echo "✅ $name: appended $added pattern(s)"
    fi
}

merge_ignore "$TEMPLATES_DIR/cursorignore.template" "$PROJECT_ROOT/.cursorignore" ".cursorignore"
merge_ignore "$TEMPLATES_DIR/cursorindexingignore.template" "$PROJECT_ROOT/.cursorindexingignore" ".cursorindexingignore"
