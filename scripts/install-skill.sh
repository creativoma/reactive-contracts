#!/bin/bash

# Reactive Contracts AI Code Review Skill Installer
# Installs the code review command for AI coding assistants
# https://github.com/creativoma/reactive-contracts

set -e

# Colors (only if stdout is a TTY)
if [ -t 1 ]; then
  GREEN='\033[32m'
  BLUE='\033[34m'
  DIM='\033[2m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  GREEN=''
  BLUE=''
  DIM=''
  BOLD=''
  RESET=''
fi

# Configuration
REPO_URL="https://raw.githubusercontent.com/creativoma/reactive-contracts/main"
COMMAND_FILE="packages/compiler/templates/reactive-contracts-review.md"
INSTALL_NAME="reactive-contracts-review.md"
INSTALLED=0

# Header
echo ""
printf "${BOLD}${BLUE}⚡ Reactive Contracts${RESET} - AI Code Review Skill Installer\n"
echo ""
printf "Installing code review command for AI coding assistants...\n"
echo ""

# Claude Code
if [ -d "$HOME/.claude" ]; then
  mkdir -p "$HOME/.claude/commands"

  # Check if already installed
  if [ -f "$HOME/.claude/commands/$INSTALL_NAME" ]; then
    # Update existing installation
    curl -fsSL -o "$HOME/.claude/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE" 2>/dev/null || {
      echo "Failed to download from GitHub. Using local fallback..."
      # Fallback: try to find local copy
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cp "packages/compiler/templates/$INSTALL_NAME" "$HOME/.claude/commands/$INSTALL_NAME"
      else
        echo "Error: Could not find command file"
        exit 1
      fi
    }
    printf "${GREEN}✓${RESET} Claude Code ${DIM}(updated)${RESET}\n"
  else
    # Fresh installation
    curl -fsSL -o "$HOME/.claude/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE" 2>/dev/null || {
      echo "Failed to download from GitHub. Using local fallback..."
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cp "packages/compiler/templates/$INSTALL_NAME" "$HOME/.claude/commands/$INSTALL_NAME"
      else
        echo "Error: Could not find command file"
        exit 1
      fi
    }
    printf "${GREEN}✓${RESET} Claude Code\n"
  fi
  INSTALLED=$((INSTALLED + 1))
fi

# Cursor (1.6+)
if [ -d "$HOME/.cursor" ]; then
  mkdir -p "$HOME/.cursor/commands"

  if [ -f "$HOME/.cursor/commands/$INSTALL_NAME" ]; then
    curl -fsSL -o "$HOME/.cursor/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE" 2>/dev/null || {
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cp "packages/compiler/templates/$INSTALL_NAME" "$HOME/.cursor/commands/$INSTALL_NAME"
      fi
    }
    printf "${GREEN}✓${RESET} Cursor ${DIM}(updated)${RESET}\n"
  else
    curl -fsSL -o "$HOME/.cursor/commands/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE" 2>/dev/null || {
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cp "packages/compiler/templates/$INSTALL_NAME" "$HOME/.cursor/commands/$INSTALL_NAME"
      fi
    }
    printf "${GREEN}✓${RESET} Cursor\n"
  fi
  INSTALLED=$((INSTALLED + 1))
fi

# OpenCode
if command -v opencode &> /dev/null || [ -d "$HOME/.config/opencode" ]; then
  mkdir -p "$HOME/.config/opencode/command"

  if [ -f "$HOME/.config/opencode/command/$INSTALL_NAME" ]; then
    curl -fsSL -o "$HOME/.config/opencode/command/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE" 2>/dev/null || {
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cp "packages/compiler/templates/$INSTALL_NAME" "$HOME/.config/opencode/command/$INSTALL_NAME"
      fi
    }
    printf "${GREEN}✓${RESET} OpenCode ${DIM}(updated)${RESET}\n"
  else
    curl -fsSL -o "$HOME/.config/opencode/command/$INSTALL_NAME" "$REPO_URL/$COMMAND_FILE" 2>/dev/null || {
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cp "packages/compiler/templates/$INSTALL_NAME" "$HOME/.config/opencode/command/$INSTALL_NAME"
      fi
    }
    printf "${GREEN}✓${RESET} OpenCode\n"
  fi
  INSTALLED=$((INSTALLED + 1))
fi

# Windsurf - appends to global_rules.md
MARKER="# Reactive Contracts Code Review"
if [ -d "$HOME/.codeium" ] || [ -d "$HOME/Library/Application Support/Windsurf" ]; then
  mkdir -p "$HOME/.codeium/windsurf/memories"
  RULES_FILE="$HOME/.codeium/windsurf/memories/global_rules.md"

  if [ -f "$RULES_FILE" ] && grep -q "$MARKER" "$RULES_FILE"; then
    printf "${GREEN}✓${RESET} Windsurf ${DIM}(already installed)${RESET}\n"
  else
    if [ -f "$RULES_FILE" ]; then
      echo "" >> "$RULES_FILE"
    fi
    echo "$MARKER" >> "$RULES_FILE"
    echo "" >> "$RULES_FILE"

    # Download and append
    curl -fsSL "$REPO_URL/$COMMAND_FILE" >> "$RULES_FILE" 2>/dev/null || {
      if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
        cat "packages/compiler/templates/$INSTALL_NAME" >> "$RULES_FILE"
      fi
    }
    printf "${GREEN}✓${RESET} Windsurf\n"
  fi
  INSTALLED=$((INSTALLED + 1))
fi

# Gemini CLI - uses TOML command format
if command -v gemini &> /dev/null || [ -d "$HOME/.gemini" ]; then
  mkdir -p "$HOME/.gemini/commands"
  TOML_FILE="$HOME/.gemini/commands/reactive-contracts-review.toml"

  # Download markdown and convert to TOML
  CONTENT=$(curl -fsSL "$REPO_URL/$COMMAND_FILE" 2>/dev/null | sed '1,/^---$/d' | sed '1,/^---$/d' || {
    if [ -f "packages/compiler/templates/$INSTALL_NAME" ]; then
      cat "packages/compiler/templates/$INSTALL_NAME" | sed '1,/^---$/d' | sed '1,/^---$/d'
    fi
  })

  cat > "$TOML_FILE" << 'TOMLEOF'
description = "Review Reactive Contracts code for best practices and anti-patterns"
prompt = """
TOMLEOF
  echo "$CONTENT" >> "$TOML_FILE"
  echo '"""' >> "$TOML_FILE"

  printf "${GREEN}✓${RESET} Gemini CLI\n"
  INSTALLED=$((INSTALLED + 1))
fi

echo ""

# Check if any tools were found
if [ $INSTALLED -eq 0 ]; then
  echo "No supported AI coding assistants detected."
  echo ""
  echo "Install one of these first:"
  echo "  • Claude Code: https://claude.ai/code"
  echo "  • Cursor: https://cursor.com"
  echo "  • OpenCode: https://opencode.ai"
  echo "  • Windsurf: https://codeium.com/windsurf"
  echo "  • Gemini CLI: https://github.com/google-gemini/gemini-cli"
  echo ""
  exit 1
fi

# Success message
printf "${BOLD}Installation complete!${RESET}\n"
echo ""
echo "Usage:"
printf "  ${DIM}/reactive-contracts-review <file>${RESET}\n"
echo ""
echo "Example:"
printf "  ${DIM}/reactive-contracts-review contracts/user.ts${RESET}\n"
echo ""
printf "Documentation: ${BLUE}https://github.com/creativoma/reactive-contracts${RESET}\n"
echo ""
