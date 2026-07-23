#!/usr/bin/env bash
set -u

echo "Node: $(node --version 2>/dev/null || echo 'no disponible')"
echo "npm: $(npm --version 2>/dev/null || echo 'no disponible')"
echo "Directorio: $(pwd)"

for file in package.json tsconfig.json src/main.ts src/app.module.ts; do
  if [ -f "$file" ]; then
    echo "OK $file"
  else
    echo "FALTA $file"
  fi
done

for variable in JWT_SECRET DATABASE_URL DB_HOST DB_USERNAME DB_NAME; do
  if [ -n "${!variable:-}" ]; then
    echo "OK $variable"
  else
    echo "NO DEFINIDA $variable"
  fi
done

if [ -d dist ] && [ -f dist/main.js ]; then
  echo "OK build dist/main.js"
else
  echo "Build no generado; ejecuta npm run build"
fi
