#!/bin/bash
RULES_DIR=".cursor/rules"
TEMPLATES_DIR="ai_toolkit/templates/cursor-rules"

mkdir -p "$RULES_DIR"
cp "$TEMPLATES_DIR"/*.template "$RULES_DIR/"
find "$RULES_DIR" -name "*.template" | while read f; do
    mv "$f" "${f%.template}"
done

# Retired always-on rules — replaced by core-digest.mdc
rm -f "$RULES_DIR/ai-toolkit-seed.mdc" "$RULES_DIR/agent-decision-gates.mdc"

rule_count=$(ls -1 "$RULES_DIR"/*.mdc 2>/dev/null | wc -l)
echo "✅ $rule_count rules installed"
