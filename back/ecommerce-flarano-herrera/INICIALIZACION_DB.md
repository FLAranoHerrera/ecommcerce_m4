# Inicialización de Base de Datos en Producción

## Problema
En producción, TypeORM está configurado con `synchronize: false` por seguridad, lo que significa que las tablas no se crean automáticamente. Esto causa errores como "relation 'products' does not exist".

## Solución: Flag DB_SYNC_ONCE

### Paso 1: Habilitar sincronización temporal
1. Ve al dashboard de Render
2. En tu servicio web, ve a "Environment"
3. Cambia la variable `DB_SYNC_ONCE` de `false` a `true`
4. Guarda los cambios
5. Render redeployará automáticamente

### Paso 2: Verificar que las tablas se crearon
Una vez que el deploy termine, verifica que las tablas se crearon:
```bash
GET https://tu-dominio-render.com/database/status
```

Deberías ver algo como:
```json
{
  "connected": true,
  "tables": ["users", "categories", "products", "orders", "order_details"]
}
```

### Paso 3: Crear datos iniciales
Ejecuta los endpoints de seed:
```bash
GET https://tu-dominio-render.com/categories/seeder
GET https://tu-dominio-render.com/products/seeder
```

### Paso 4: Deshabilitar sincronización (IMPORTANTE)
1. Ve de nuevo al dashboard de Render
2. En "Environment", cambia `DB_SYNC_ONCE` de `true` a `false`
3. Guarda los cambios
4. Render redeployará automáticamente

## ⚠️ IMPORTANTE
- **NUNCA** dejes `DB_SYNC_ONCE=true` en producción permanentemente
- Solo úsalo para la inicialización inicial
- Después de crear las tablas, siempre ponlo en `false`

## Verificación final
Después de completar todos los pasos, prueba:
```bash
GET https://tu-dominio-render.com/products?page=1&limit=10
```

Deberías obtener una respuesta exitosa con productos.

## Alternativa: Usar la consola de Render
Si prefieres usar la consola de Render:
1. Ve a tu servicio web
2. Click en "Shell"
3. Ejecuta:
```bash
npm run start:prod
```
Esto te permitirá ver los logs en tiempo real durante la inicialización.

## Troubleshooting
- Si ves errores de conexión, verifica que `DATABASE_URL` esté configurada correctamente
- Si las tablas no se crean, verifica que `DB_SYNC_ONCE=true` esté configurado
- Si los seeds fallan, verifica que las tablas existan primero
