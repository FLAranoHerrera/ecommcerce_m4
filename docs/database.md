# Base de datos y migraciones

TypeORM utiliza migraciones y nunca sincroniza automáticamente el esquema.

## PostgreSQL local o pgAdmin

1. Crea una base llamada `ecommerce`.
2. Copia `.env.example` como `.env`.
3. Configura `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` y `DB_NAME`.
4. Mantén `DB_SSL=false` para PostgreSQL local.
5. Ejecuta:

```bash
npm run migration:show
npm run migration:run
npm run start:dev
```

## Docker

```bash
docker compose up -d --build
```

La aplicación usa el servicio `db`, aplica migraciones pendientes y expone
PostgreSQL localmente en el puerto `5433`.

## Producción

Usa `DATABASE_URL`, `DB_SSL=true` y `DB_MIGRATIONS_RUN=true`. No habilites
usuarios de prueba ni guardes archivos `.env` en Git.
