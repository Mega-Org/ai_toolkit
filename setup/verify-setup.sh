#!/bin/bash
# Verify Cursor skill install and lean-loading budgets (warnings unless noted).
set -euo pipefail

errors=0
warnings=0

warn() {
  echo "⚠️  $*"
  ((warnings++)) || true
}

fail() {
  echo "❌ $*"
  ((errors++)) || true
}

kb() { wc -c < "$1" | tr -d ' '; }

[ -d ".cursor/skills" ] && echo "✅ .cursor/skills/" || fail ".cursor/skills/ missing"

for skill in autopilot-plan feature-make-plan feature-implement-phase bugfix backend-contract feature-verify-pr; do
  if [ -f ".cursor/skills/$skill/SKILL.md" ]; then
    echo "✅ $skill"
  else
    warn "$skill missing"
  fi
done

if [ -f ".cursorignore" ]; then
  echo "✅ .cursorignore"
else
  warn ".cursorignore missing (run ai_toolkit/setup/install-ignore.sh)"
fi

if [ -f ".cursorindexingignore" ]; then
  echo "✅ .cursorindexingignore"
else
  warn ".cursorindexingignore missing (run ai_toolkit/setup/install-ignore.sh)"
fi

# --- Always-on budget (4 KB) ---
always_on=0
for f in AGENTS.md CLAUDE.md; do
  [ -f "$f" ] && always_on=$((always_on + $(kb "$f")))
done
if [ -d ".cursor/rules" ]; then
  for mdc in .cursor/rules/*.mdc; do
    [ -f "$mdc" ] || continue
    if grep -q 'alwaysApply: true' "$mdc" 2>/dev/null; then
      always_on=$((always_on + $(kb "$mdc")))
    fi
  done
fi
if [ "$always_on" -gt 4096 ]; then
  warn "always-on context ${always_on} B exceeds 4096 B budget (retire duplicate always-on rules; use core-digest.mdc)"
else
  echo "✅ always-on ${always_on} B (budget 4096 B)"
fi

# --- Feature plans: size + required phase fields ---
shopt -s nullglob
for plan in ai_specs/features/*/plan.md; do
  [ -f "$plan" ] || continue
  size=$(kb "$plan")
  if [ "$size" -gt 8192 ]; then
    warn "$plan ${size} B exceeds 8192 B — split done phases to history.md"
  fi
  slug=$(basename "$(dirname "$plan")")
  readme="ai_specs/features/$slug/README.md"
  if [ -f "$readme" ] && grep -q '^## Contract' "$readme" 2>/dev/null; then
    csize=$(awk '/^## Contract([[:space:]]|$)/{found=1} found && /^## / && !/^## Contract([[:space:]]|$)/{exit} found{print}' "$readme" | wc -c | tr -d ' ')
    if [ "$csize" -gt 6144 ]; then
      warn "$readme Contract section ~${csize} B exceeds 6144 B"
    fi
  fi
  mem="ai_specs/features/$slug/memory.md"
  if [ -f "$mem" ]; then
    msize=$(kb "$mem")
    if [ "$msize" -gt 3072 ]; then
      warn "$mem ${msize} B exceeds 3072 B"
    fi
  fi
done

# One summary per legacy plan. Only pending phases must have Load, Inputs, and Touches.
while IFS= read -r line; do
  [ -z "$line" ] && continue
  warn "$line"
done < <(python3 - <<'PY'
import re
from pathlib import Path
root = Path(".")
fields = ("Load:", "Inputs:", "Touches:")
for plan in sorted((root / "ai_specs/features").glob("*/plan.md")):
    text = plan.read_text(encoding="utf-8")
    headers = list(re.finditer(r"^### Phase \d+.*$", text, re.M))
    missing = 0
    for i, m in enumerate(headers):
        start = m.end()
        end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        block = text[start:end]
        st = re.search(r"^Status:\s*(.+)$", block, re.M)
        if not st or not re.search(r"\bpending\b", st.group(1).lower()):
            continue
        if any(not re.search(r"^" + re.escape(field), block, re.M) for field in fields):
            missing += 1
    if missing:
        noun = "phase" if missing == 1 else "phases"
        print(f"{plan}: {missing} pending {noun} missing Load, Inputs, or Touches")
PY
)

# --- Implement-phase startup: 15 KB + about 6 KB per Load tag ---
# Legacy pending phases with no Load: stay on the plan-size warnings above.
if [ -f "ai_toolkit/bin/toolkit-context" ]; then
  startup_report=$(python3 - <<'PY'
import importlib.machinery
import importlib.util
import sys
from pathlib import Path

loader = importlib.machinery.SourceFileLoader(
    "toolkit_context", "ai_toolkit/bin/toolkit-context"
)
spec = importlib.util.spec_from_loader(loader.name, loader)
mod = importlib.util.module_from_spec(spec)
sys.modules[loader.name] = mod
loader.exec_module(mod)

root = Path(".").resolve()
toolkit = root / "ai_toolkit"
checked = 0
warned = False
for plan in sorted(Path("ai_specs/features").glob("*/plan.md")):
    feature = plan.parent.name
    for phase in mod.parse_phases(plan.read_text(encoding="utf-8")):
        status = phase.status.lower()
        active = "pending" in status or "in-progress" in status or "in_progress" in status
        if not active or not phase.load_tags:
            continue
        checked += 1
        rows = mod.build_implement_load(root, toolkit, feature, phase, [], [], False)
        total = sum(row.bytes for row in rows)
        tag_count = len(set(phase.load_tags))
        budget = mod.startup_budget(tag_count)
        if total > budget:
            warned = True
            noun = "tag" if tag_count == 1 else "tags"
            print(
                f"{plan} phase {phase.number} startup {total} B exceeds {budget} B "
                f"(15 KB + about 6 KB × {tag_count} {noun})"
            )
if not warned:
    suffix = "" if checked == 0 else f" ({checked} pending phase(s) within budget)"
    print(f"OK implement-phase startup budget is 15 KB + about 6 KB per Load tag{suffix}")
PY
) || warn "implement-phase startup budget check failed"
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    case "$line" in
      OK\ *) echo "✅ ${line#OK }" ;;
      *) warn "$line" ;;
    esac
  done <<< "$startup_report"
fi

if [ -f "ai_docs/memory.md" ]; then
  asize=$(kb "ai_docs/memory.md")
  if [ "$asize" -gt 4096 ]; then
    warn "ai_docs/memory.md ${asize} B exceeds 4096 B"
  else
    echo "✅ ai_docs/memory.md ${asize} B"
  fi
fi

# --- LOADMAP tagged leaves need Agent card ---
if [ -f "ai_toolkit/LOADMAP.md" ]; then
  while IFS= read -r rel; do
    [ -z "$rel" ] && continue
    case "$rel" in
      ai_docs/*) leaf="$rel" ;;
      *) leaf="ai_toolkit/$rel" ;;
    esac
    [ "$rel" = "ai_docs/memory.md" ] && continue
    if [ -f "$leaf" ] && ! grep -q "^## Agent card" "$leaf" 2>/dev/null; then
      warn "$leaf missing ## Agent card (LOADMAP tagged leaf)"
    fi
  done < <(python3 - <<'PY'
import re
from pathlib import Path
text = Path("ai_toolkit/LOADMAP.md").read_text(encoding="utf-8")
seen = set()
for line in text.splitlines():
    if not line.startswith("| `"):
        continue
    parts = [p.strip() for p in line.split("|")]
    if len(parts) < 3:
        continue
    for p in re.findall(r"`([^`]+)`", parts[2]):
        if p.endswith(".md") and p not in seen:
            seen.add(p)
            print(p)
PY
)
fi

# --- Contract request sizes + register rows ---
if [ -d "ai_specs/api/contracts" ]; then
  for req in ai_specs/api/contracts/*/request.md; do
    [ -f "$req" ] || continue
    rsize=$(kb "$req")
    if [ "$rsize" -gt 25600 ]; then
      warn "$req ${rsize} B exceeds 25600 B"
    fi
    folder=$(basename "$(dirname "$req")")
    if [ -f "ai_specs/api/contracts/INDEX.md" ] && ! grep -q "$folder" ai_specs/api/contracts/INDEX.md 2>/dev/null; then
      warn "contract folder $folder has request.md but no register row in contracts/INDEX.md"
    fi
  done
fi

# Legacy feature-folder requests stay in place. Skip answered/sent; those are closed.
for req in ai_specs/features/*/backend-contract*.md; do
  [ -f "$req" ] || continue
  status_line=$(grep -m1 -E '^Status:' "$req" || true)
  status=$(printf '%s' "$status_line" | sed -E 's/^Status:[[:space:]]*//; s/[[:space:]].*//; s/[*`]//g' | tr '[:upper:]' '[:lower:]')
  case "$status" in
    answered|sent) continue ;;
  esac
  rsize=$(kb "$req")
  if [ "$rsize" -gt 25600 ]; then
    warn "$req ${rsize} B exceeds 25600 B"
  fi
done

if [ -f "ai_toolkit/bin/toolkit-context" ]; then
  echo "✅ toolkit context command present"
else
  warn "ai_toolkit/bin/toolkit-context missing"
fi

# --- Stub markers and broken links (ai_toolkit, excluding templates/) ---
if [ -d "ai_toolkit" ]; then
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    fail "stub marker in $f (remove <!-- Fill in later --> from Content sections)"
  done < <(python3 - <<'PY'
from pathlib import Path
root = Path("ai_toolkit")
for path in root.rglob("*.md"):
    if "templates" in path.parts:
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    if "<!-- Fill in later" in text:
        print(path)
PY
)
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    kind="${line%%$'\t'*}"
    rest="${line#*$'\t'}"
    if [ "$kind" = "warn" ]; then
      warn "broken link (outside ai_toolkit): $rest"
    else
      fail "broken link: $rest"
    fi
  done < <(python3 - <<'PY'
import re
from pathlib import Path
root = Path("ai_toolkit").resolve()
for path in Path("ai_toolkit").rglob("*.md"):
    if "templates" in path.parts:
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    for m in re.finditer(r'\]\(([^)]+)\)', text):
        target = m.group(1).split("#")[0].strip()
        if not target or target.startswith("http"):
            continue
        resolved = (path.parent / target).resolve()
        try:
            resolved.relative_to(root)
            outside = False
        except ValueError:
            outside = True
        if resolved.exists():
            continue
        kind = "warn" if outside else "fail"
        print(f"{kind}\t{path} -> {target}")
PY
)
fi

echo ""
if [ "$errors" -eq 0 ] && [ "$warnings" -eq 0 ]; then
  echo "✅ Verified (no budget warnings)"
elif [ "$errors" -eq 0 ]; then
  echo "✅ Verified with $warnings budget/structure warning(s)"
else
  echo "⚠️  $errors error(s), $warnings warning(s)"
fi

exit $errors
