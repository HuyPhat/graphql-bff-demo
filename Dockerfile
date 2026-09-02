# ---- Stage 1: build (TypeScript server + Vite client) ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci

COPY server server
COPY client client
RUN npm run build

# ---- Stage 2: production dependencies only (omit dev) ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --omit=dev

# ---- Stage 3: slim runtime, one container serves client + GraphQL ----
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/client/dist client/dist
COPY server/package.json server/

EXPOSE 4000

CMD ["node", "server/dist/index.js"]