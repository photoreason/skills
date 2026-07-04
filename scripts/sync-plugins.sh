#!/usr/bin/env bash
#
# Keeps the per-platform plugin manifests' version in lockstep with
# package.json. Skills themselves are shared from ./skills — no copying needed;
# every platform manifest points at "./skills/". This script only checks that
# the declared versions agree, so a release can't ship mismatched manifests.
#
# Usage: pnpm sync:plugins   (or: bash scripts/sync-plugins.sh)

set -euo pipefail

cd "$(dirname "$0")/.."

version="$(node -p "require('./package.json').version")"
echo "package.json version: $version"

files=(
  ".claude-plugin/plugin.json"
  ".codex-plugin/plugin.json"
  ".cursor-plugin/plugin.json"
  ".kimi-plugin/plugin.json"
  "gemini-extension.json"
)

status=0
for f in "${files[@]}"; do
  v="$(node -p "require('./$f').version")"
  if [ "$v" != "$version" ]; then
    echo "MISMATCH: $f is $v (expected $version)"
    status=1
  else
    echo "ok: $f"
  fi
done

mv="$(node -p "require('./.claude-plugin/marketplace.json').plugins[0].version")"
if [ "$mv" != "$version" ]; then
  echo "MISMATCH: .claude-plugin/marketplace.json plugins[0] is $mv (expected $version)"
  status=1
else
  echo "ok: .claude-plugin/marketplace.json"
fi

exit "$status"
