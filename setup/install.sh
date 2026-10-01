#!/bin/bash
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

echo "🔍 Verifying..."
bash "$TOOLKIT_DIR/setup/verify-setup.sh"

echo ""
echo "🎉 Installation complete!"
