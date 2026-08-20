FROM node:22.18.0-alpine AS build
RUN apk update && apk upgrade
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -------- Runtime --------
FROM node:22.18.0-alpine AS server
RUN apk update && apk upgrade
WORKDIR /app

COPY --from=build --chown=node:node /app/dist /app/dist
COPY --from=build --chown=node:node /app/node_modules /app/node_modules

COPY --chown=node:node docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node
EXPOSE 4000

ENTRYPOINT ["/entrypoint.sh"]