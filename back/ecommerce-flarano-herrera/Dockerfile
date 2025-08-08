# Etapa 1: Build
FROM node:20 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --only=production

USER node

# CMD ["node", "dist/main"]

CMD node dist/main > /tmp/app.log 2>&1 ; cat /tmp/app.log