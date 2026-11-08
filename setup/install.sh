#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Magdy Ebrahim
set -e
echo "🚀 ai_toolkit Installation"
echo ""
PROJECT_ROOT=$(pwd)
TOOLKIT_DIR="$PROJECT_ROOT/ai_toolkit"

if [ ! -d "$TOOLKIT_DIR" ]; then
    echo "❌ ai_toolkit not found"
    exit 1
fi

echo "✅ ai_toolkit found"
echo ""

echo "📁 Creating directories..."
mkdir -p .cursor/skills
mkdir -p .cursor/rules
mkdir -p .cursor/plans

echo "🔧 Installing skills..."
bash "$TOOLKIT_DIR/setup/install-skills.sh"

echo "📋 Installing rules..."
bash "$TOOLKIT_DIR/setup/install-rules.sh"

echo "🚫 Installing Cursor ignore files..."
bash "$TOOLKIT_DIR/setup/install-ignore.sh"

echo "🔎 Applying search exclusions..."
bash "$TOOLKIT_DIR/setup/install-vscode-search.sh"

VERSION="$(cat "$TOOLKIT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]')"
if [ -n "$VERSION" ]; then
  echo "$VERSION" > .cursor/.ai_toolkit_version
  echo "📌 Wrote .cursor/.ai_toolkit_version ($VERSION)"
fi

# Apache-2.0 attribution travels with the copy (License, Section 4).
# Keep LICENSE/NOTICE in the app root and record the license for this install.
for legal in LICENSE NOTICE; do
  if [ -f "$TOOLKIT_DIR/$legal" ] && [ ! -f "$PROJECT_ROOT/$legal" ]; then
    cp "$TOOLKIT_DIR/$legal" "$PROJECT_ROOT/$legal"
    echo "⚖️  Copied $legal"
  elif [ ! -f "$TOOLKIT_DIR/$legal" ]; then
    echo "⚠️  $legal missing from ai_toolkit — attribution is incomplete"
  fi
done

mkdir -p .cursor
{
  echo "SPDX-License-Identifier: Apache-2.0"
  echo "Copyright 2026 Magdy Ebrahim"
  [ -n "$VERSION" ] && echo "Toolkit-Version: $VERSION"
  echo "License-Text: LICENSE"
} > .cursor/.ai_toolkit_license
echo "📌 Wrote .cursor/.ai_toolkit_license (Apache-2.0)"

echo "🔍 Verifying..."
bash "$TOOLKIT_DIR/setup/verify-setup.sh"

echo ""
echo "🎉 Installation complete!"
