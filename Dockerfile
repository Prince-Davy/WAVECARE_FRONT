# Devsecops: upgrade de 12 à 18
FROM node:22.18.0-alpine AS build
# FROM node:22.12.0-alpine AS server

RUN apk update && apk upgrade
WORKDIR /app

COPY package*.json ./
# RUN node --version && npm --version && npm ci --verbose
# DevSecOps : utilisation de PNPM avec le lockfile du projet pour garantir une installation reproductible.
RUN corepack enable \
    && corepack prepare pnpm@9.15.0 --activate \
    && node --version \
    && pnpm --version \
    && HUSKY=0 pnpm i --frozen-lockfile
COPY . .
RUN npm run build

# -------- Runtime --------
# Devsecops: upgrade de 12 à 18
FROM node:22.18.0-alpine AS server
# FROM node:22.12.0-alpine AS server
RUN apk update && apk upgrade
WORKDIR /app

COPY --from=build --chown=node:node /app/dist /app/dist
COPY --from=build --chown=node:node /app/node_modules /app/node_modules

COPY --chown=node:node docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node
EXPOSE 4000

ENTRYPOINT ["/entrypoint.sh"]