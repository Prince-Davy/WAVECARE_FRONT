
# Build Angular SSR (image légère)
FROM node:24-alpine AS build

WORKDIR /app

# Installe exactement les versions du lockfile
COPY package*.json ./
RUN npm ci

# Build SSR
COPY . .
RUN npm run build

# Runtime minimal
FROM node:24-alpine AS server

WORKDIR /app

# Copie uniquement ce qui est nécessaire au runtime
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./

# Installe uniquement les deps runtime (prod)
RUN npm ci --omit=dev

# Exécuter en non-root (Node image fournit l'utilisateur 'node')
USER node

EXPOSE 4000
CMD ["node", "dist/wavecare-front/server/server.mjs"]
