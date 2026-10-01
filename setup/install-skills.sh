#!/bin/bash
SKILLS_DIR=".cursor/skills"
TEMPLATES_DIR="ai_toolkit/templates/cursor-skills"

install_skill() {
    local skill=$1
    echo "  → $skill"
    cp -r "$TEMPLATES_DIR/$skill" "$SKILLS_DIR/"
    find "$SKILLS_DIR/$skill" -name "*.template" | while read f; do
        mv "$f" "${f%.template}"
    done
}

install_skill "feature-make-plan"
install_skill "feature-implement-phase"
install_skill "bugfix"
install_skill "autopilot-plan"
install_skill "backend-contract"
install_skill "feature-verify-pr"

echo "✅ 6 skills installed"
