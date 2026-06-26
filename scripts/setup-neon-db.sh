#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Sätt DATABASE_URL först, t.ex.:"
  echo 'export DATABASE_URL="postgresql://..."'
  exit 1
fi

echo "→ Kör migrationer mot Neon..."
npm run db:migrate:deploy --workspace @nordstrand/api

echo "→ Seed produkter..."
npm run db:seed --workspace @nordstrand/api

echo "✓ Databas klar."
