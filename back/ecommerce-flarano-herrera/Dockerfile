# ---------- Stage 1: Build ----------
FROM node:22 AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json antes para cachear dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies) para compilar
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos TypeScript
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:22-alpine AS production

WORKDIR /app

# Copiamos solo lo necesario desde el builder
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY tsconfig.json ./tsconfig.json

# Exponemos el puerto de NestJS
EXPOSE 3000

# Comando de inicio
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]
