
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

USER node

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

USER node

EXPOSE 3000

CMD ["node", "dist/main"]