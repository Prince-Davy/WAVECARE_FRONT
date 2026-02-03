#!/bin/sh
set -e

# API_URL est injectée par Helm/Vault (env du Pod)
: "${API_URL:?API_URL doit être définie}"

CONFIG_PATH="/app/dist/wavecare-front/browser/assets/config.json"

mkdir -p "$(dirname "$CONFIG_PATH")"

cat > "$CONFIG_PATH" <<EOF
{
  "apiBaseUrl": "${API_URL}"
}
EOF

echo "[INFO] Config runtime générée dans $CONFIG_PATH :"
cat "$CONFIG_PATH"

# Démarre le serveur Angular Universal (SSR)
exec node /app/dist/wavecare-front/server/server.mjs