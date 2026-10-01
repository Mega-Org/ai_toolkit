#!/bin/bash
errors=0

[ -d ".cursor/skills" ] && echo "✅ .cursor/skills/" || ((errors++))

for skill in autopilot-plan feature-make-plan feature-implement-phase bugfix backend-contract; do
    if [ -f ".cursor/skills/$skill/SKILL.md" ]; then
        echo "✅ $skill"
    else
        echo "⚠️  $skill missing"
    fi
done

if [ -f ".cursorignore" ]; then
    echo "✅ .cursorignore"
else
    echo "⚠️  .cursorignore missing (run ai_toolkit/setup/install-ignore.sh)"
fi

if [ -f ".cursorindexingignore" ]; then
    echo "✅ .cursorindexingignore"
else
    echo "⚠️  .cursorindexingignore missing (run ai_toolkit/setup/install-ignore.sh)"
fi

[ $errors -eq 0 ] && echo "✅ Verified" || echo "⚠️  $errors errors"
