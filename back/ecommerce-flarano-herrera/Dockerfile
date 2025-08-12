# ---------- Etapa 1: Build (Constructor) ----------
FROM node:22 AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json para cachear dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies) para compilar
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto de TypeScript a JavaScript
RUN npm run build

# ---------- Etapa 2: Runtime (Producción) ----------
FROM node:22-alpine AS production

WORKDIR /app

# Copiamos el package.json para instalar solo las dependencias de producción
COPY package*.json ./
RUN npm install --only=production

# Desde el 'builder', copiamos los artefactos de la compilación
COPY --from=builder /app/dist ./dist

# ==================== CAMBIOS CLAVE ====================

# 1. Copia el archivo .env.docker y lo renombra a .env para que NestJS lo cargue
COPY .env.docker .env

# 2. Copia el tsconfig para que los alias de rutas (@/...) funcionen en producción
COPY tsconfig.json ./tsconfig.json

# =======================================================

# Exponemos el puerto de la aplicación
EXPOSE 3000

# Comando final para iniciar la aplicación
# Usa tsconfig-paths para resolver los alias de importación
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]
