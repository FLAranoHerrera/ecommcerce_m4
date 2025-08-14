#!/bin/bash

# Script de build para Render
echo "🚀 Iniciando build para Render..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --only=production=false

# Compilar el proyecto
echo "🔨 Compilando proyecto..."
npm run build

# Limpiar cache
echo "🧹 Limpiando cache..."
npm cache clean --force

echo "✅ Build completado exitosamente!"
