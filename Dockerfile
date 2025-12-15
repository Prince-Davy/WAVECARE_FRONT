
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

FROM node:24-alpine AS server

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./


RUN npm install --omit=dev

USER node

EXPOSE 4000
CMD ["node", "dist/wavecare-front/server/server.mjs"]
