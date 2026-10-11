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

COPY package*.json ./

# Runtime uniquement : aucune devDependency
RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=build --chown=node:node /app/dist /app/dist

COPY --chown=node:node docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
    && chown node:node /entrypoint.sh

USER node

EXPOSE 4000

ENTRYPOINT ["/entrypoint.sh"]