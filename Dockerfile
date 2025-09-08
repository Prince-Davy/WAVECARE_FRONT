# Build Angular SSR
FROM node:24.7.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@10.9.3
RUN npm install

COPY . .

RUN npm run build

# Starting Node.js Server
FROM node:24.7.0 AS server

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./

# Install only dependencies and excludes devDependencies, reducing the size of the image
RUN npm install --omit=dev

EXPOSE 4000

CMD ["node", "dist/wavecare-front/server/server.mjs"]
