#!/bin/bash

# Script de build para Render
set -e  # Salir en caso de error

echo "🚀 Iniciando build para Render..."

# Verificar variables de entorno críticas
echo "🔍 Verificando variables de entorno..."
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  ADVERTENCIA: DATABASE_URL no está definida"
fi

if [ -z "$JWT_SECRET" ]; then
  echo "⚠️  ADVERTENCIA: JWT_SECRET no está definida"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --only=production=false

# Verificar que TypeScript esté instalado
echo "🔍 Verificando TypeScript..."
npx tsc --version

# Compilar el proyecto
echo "🔨 Compilando proyecto..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
  echo "❌ ERROR: El directorio dist no fue creado"
  exit 1
fi

if [ ! -f "dist/main.js" ]; then
  echo "❌ ERROR: El archivo dist/main.js no fue creado"
  exit 1
fi

echo "✅ Verificación de build exitosa"

# Limpiar cache
echo "🧹 Limpiando cache..."
npm cache clean --force

echo "✅ Build completado exitosamente!"
