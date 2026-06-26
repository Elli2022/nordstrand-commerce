#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../apps/web/public/images/products" && pwd)"

if ! command -v cwebp >/dev/null; then
  echo "Install cwebp first, e.g. brew install webp"
  exit 1
fi

for png in "$DIR"/*.png; do
  [ -f "$png" ] || continue
  out="${png%.png}.webp"
  cwebp -quiet -q 82 -resize 900 0 "$png" -o "$out"
  echo "→ $(basename "$out") ($(du -h "$out" | cut -f1))"
done

echo "✓ Product images optimized."
