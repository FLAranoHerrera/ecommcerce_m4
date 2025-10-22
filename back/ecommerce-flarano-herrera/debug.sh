#!/bin/bash

# Script de diagnóstico para deployment en Render
echo "🔍 DIAGNÓSTICO DE DEPLOYMENT - ECOMMERCE M4"
echo "=============================================="

# Información del sistema
echo "📊 INFORMACIÓN DEL SISTEMA:"
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Sistema operativo: $(uname -a)"
echo "Directorio actual: $(pwd)"
echo ""

# Variables de entorno
echo "🌍 VARIABLES DE ENTORNO:"
echo "NODE_ENV: ${NODE_ENV:-'no definida'}"
echo "PORT: ${PORT:-'no definida'}"
echo "DATABASE_URL: ${DATABASE_URL:+'definida'}"
echo "JWT_SECRET: ${JWT_SECRET:+'definida'}"
echo "CLOUDINARY_NAME: ${CLOUDINARY_NAME:+'definida'}"
echo "CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY:+'definida'}"
echo "CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET:+'definida'}"
echo ""

# Verificar archivos críticos
echo "📁 ARCHIVOS CRÍTICOS:"
[ -f "package.json" ] && echo "✅ package.json existe" || echo "❌ package.json NO existe"
[ -f "tsconfig.json" ] && echo "✅ tsconfig.json existe" || echo "❌ tsconfig.json NO existe"
[ -f "src/main.ts" ] && echo "✅ src/main.ts existe" || echo "❌ src/main.ts NO existe"
[ -f "src/app.module.ts" ] && echo "✅ src/app.module.ts existe" || echo "❌ src/app.module.ts NO existe"
[ -f "build.sh" ] && echo "✅ build.sh existe" || echo "❌ build.sh NO existe"
echo ""

# Verificar dependencias
echo "📦 DEPENDENCIAS:"
if [ -d "node_modules" ]; then
  echo "✅ node_modules existe"
  echo "Número de paquetes instalados: $(ls node_modules | wc -l)"
else
  echo "❌ node_modules NO existe"
fi
echo ""

# Verificar build
echo "🔨 ESTADO DEL BUILD:"
if [ -d "dist" ]; then
  echo "✅ Directorio dist existe"
  [ -f "dist/main.js" ] && echo "✅ dist/main.js existe" || echo "❌ dist/main.js NO existe"
  echo "Tamaño del directorio dist: $(du -sh dist 2>/dev/null || echo 'No disponible')"
else
  echo "❌ Directorio dist NO existe"
fi
echo ""

# Verificar permisos
echo "🔐 PERMISOS:"
[ -x "build.sh" ] && echo "✅ build.sh es ejecutable" || echo "❌ build.sh NO es ejecutable"
[ -x "debug.sh" ] && echo "✅ debug.sh es ejecutable" || echo "❌ debug.sh NO es ejecutable"
echo ""

# Verificar configuración de TypeScript
echo "⚙️  CONFIGURACIÓN TYPESCRIPT:"
if command -v tsc >/dev/null 2>&1; then
  echo "✅ TypeScript está instalado: $(npx tsc --version)"
else
  echo "❌ TypeScript NO está instalado"
fi
echo ""

# Verificar configuración de base de datos
echo "🗄️  CONFIGURACIÓN DE BASE DE DATOS:"
if [ -n "$DATABASE_URL" ]; then
  echo "✅ DATABASE_URL está definida"
  # Extraer información de la URL sin mostrar credenciales
  DB_INFO=$(echo $DATABASE_URL | sed 's/:\/\/[^@]*@/:\/\/***:***@/')
  echo "URL de conexión: $DB_INFO"
else
  echo "❌ DATABASE_URL NO está definida"
fi
echo ""

# Verificar configuración de JWT
echo "🔑 CONFIGURACIÓN JWT:"
if [ -n "$JWT_SECRET" ]; then
  echo "✅ JWT_SECRET está definida"
  echo "Longitud del secret: ${#JWT_SECRET} caracteres"
else
  echo "❌ JWT_SECRET NO está definida"
fi
echo ""

# Verificar configuración de Cloudinary
echo "☁️  CONFIGURACIÓN CLOUDINARY:"
if [ -n "$CLOUDINARY_NAME" ] && [ -n "$CLOUDINARY_API_KEY" ] && [ -n "$CLOUDINARY_API_SECRET" ]; then
  echo "✅ Todas las variables de Cloudinary están definidas"
else
  echo "❌ Faltan variables de Cloudinary:"
  [ -z "$CLOUDINARY_NAME" ] && echo "  - CLOUDINARY_NAME"
  [ -z "$CLOUDINARY_API_KEY" ] && echo "  - CLOUDINARY_API_KEY"
  [ -z "$CLOUDINARY_API_SECRET" ] && echo "  - CLOUDINARY_API_SECRET"
fi
echo ""

echo "🏁 DIAGNÓSTICO COMPLETADO"
echo "Si encuentras errores, revisa la configuración en render.yaml"
