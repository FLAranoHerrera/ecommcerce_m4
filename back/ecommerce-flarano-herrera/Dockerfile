# ---- Etapa 1: Builder ----
# Aquí instalamos todas las dependencias (incluidas las de desarrollo) y construimos el proyecto.
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de manifiesto del proyecto
COPY package*.json ./

# Instalamos todas las dependencias
RUN npm install

# Copiamos todo el código fuente de la aplicación
COPY . .

# Construimos la aplicación para producción. Esto generará la carpeta 'dist'.
RUN npm run build

# ---- Etapa 2: Producción ----
# Esta es la imagen final. Es mucho más pequeña porque no contiene devDependencies ni el código fuente original.
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos solo los archivos necesarios de la etapa 'builder'
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Instalamos ÚNICAMENTE las dependencias de producción
RUN npm ci --only=production

# Exponemos el puerto que usa la aplicación (Render lo asignará dinámicamente)
EXPOSE 3000

# El comando para iniciar la aplicación en producción
CMD ["node", "dist/main"]