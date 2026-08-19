#!/bin/sh
set -e

# API_URL est injectée par Helm/Vault (env du Pod)
: "${API_URL:?API_URL doit être définie}"
# Ajout DevSecOps: Pour intégrer la clé api strapi dans les variables d'environnement
: "${STRAPI_API_TOKEN:?STRAPI_API_TOKEN doit être défini}"

CONFIG_PATH="/app/dist/wavecare-front/browser/assets/config.json"

mkdir -p "$(dirname "$CONFIG_PATH")"

# Ajout DevSecOps: Pour intégrer la clé api strapi dans les variables d'environnement
cat > "$CONFIG_PATH" <<EOF
{
  "apiBaseUrl": "${API_URL}",
  "strapiApiToken": "${STRAPI_API_TOKEN}"
}
EOF

echo "[INFO] Config runtime générée dans $CONFIG_PATH :"

# Ajout DevSecOps: ligne d'en dessous commenté pour ne pas afficher les secrets
#cat "$CONFIG_PATH"

# Démarre le serveur Angular Universal (SSR)
exec node /app/dist/wavecare-front/server/server.mjs