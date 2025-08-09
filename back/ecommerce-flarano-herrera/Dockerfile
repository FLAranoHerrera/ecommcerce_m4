# Etapa 1: Builder
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos todas las dependencias (incluidas dev)
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Construimos la app para producción (genera dist/)
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json para instalar solo prod dependencies
COPY package*.json ./

# Copiamos node_modules desde builder para no reinstalar en prod
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiamos la carpeta dist con el código compilado
COPY --from=builder /usr/src/app/dist ./dist

# Puerto que exponemos (Render usa variable PORT pero aquí 3000 por defecto)
EXPOSE 3000

# Comando para iniciar la app en producción
CMD ["node", "dist/main.js"]
