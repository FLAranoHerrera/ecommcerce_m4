# Despliegue

## Variables obligatorias

- `JWT_SECRET`: secreto aleatorio de al menos 32 caracteres.
- `DATABASE_URL`: conexión PostgreSQL del proveedor.
- `DB_SSL=true`: para proveedores que exigen TLS.
- `DB_MIGRATIONS_RUN=true`: aplica migraciones pendientes al arrancar.
- `CORS_ORIGINS`: dominios permitidos separados por coma.

Cloudinary requiere las tres variables `CLOUDINARY_NAME`,
`CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`. Si no se configura, la API
funciona, pero la carga de imágenes responde `503`.

## Render

El archivo `render.yaml` construye desde la raíz mediante:

```bash
npm ci && npm run build
```

El proceso inicia con `npm run start:prod` y verifica `/health`. Mantén
`ENABLE_SWAGGER=false` y `SEED_TEST_USERS=false` en producción.

## Docker

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f app
```

Compose conserva PostgreSQL en el volumen `postgres-data` y ejecuta
migraciones pendientes durante el arranque de la API.

## Verificación previa

```bash
npm ci
npm run lint
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```
