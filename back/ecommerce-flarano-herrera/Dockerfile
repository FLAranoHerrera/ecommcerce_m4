# Etapa 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción (Versión final con arreglo de permisos)
FROM node:20-alpine

WORKDIR /app

# Copia los archivos de dependencias
COPY --from=builder /app/package*.json ./
# Instala solo las dependencias de producción
RUN npm install --only=production
# Copia el código compilado de tu aplicación
COPY --from=builder /app/dist ./dist

# --- ARREGLO DE PERMISOS (LA LLAVE DEL PROBLEMA) ---
# Cambiamos el dueño de todos los archivos en /app al usuario 'node'
RUN chown -R node:node /app

# Ahora, cambiamos al usuario no-root
USER node

# Entramos al directorio donde está el código compilado
WORKDIR /app/dist

# Comando final para iniciar la aplicación
CMD ["node", "main.js"]