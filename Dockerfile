FROM node:25-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# -------- Runtime --------
FROM node:25-alpine AS server
WORKDIR /app

COPY --from=build --chown=node:node /app/dist /app/dist
COPY --from=build --chown=node:node /app/node_modules /app/node_modules

COPY --chown=node:node docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER node
EXPOSE 4000

ENTRYPOINT ["/entrypoint.sh"]