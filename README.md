# E-commerce API

API REST de comercio electrónico construida con NestJS 11, TypeORM,
PostgreSQL, JWT y Cloudinary.

## Requisitos

- Node.js 20 o superior (se recomienda Node.js 22)
- npm
- PostgreSQL 16, local o mediante Docker
- Cuenta de Cloudinary para subir imágenes

## Inicio rápido con Docker

```bash
cp .env.example .env
# Configura DB_PASSWORD, JWT_SECRET y, opcionalmente, Cloudinary.
docker compose up -d --build
```

La API queda disponible en `http://localhost:3000` y Swagger en
`http://localhost:3000/api`.

Docker ejecuta automáticamente las migraciones pendientes. El volumen
`postgres-data` conserva la base entre reinicios.

## Desarrollo local

```bash
cp .env.example .env
npm ci
npm run migration:run
npm run start:dev
```

Los comandos deben ejecutarse desde la raíz de este repositorio, donde está
`package.json`.

## Scripts

```bash
npm run build
npm run lint
npm run lint:fix
npm test
npm run test:e2e
npm run test:cov
npm run migration:show
npm run migration:run
npm run migration:revert
```

## Módulos

- `auth`: registro, inicio de sesión y emisión de JWT.
- `users`: perfiles, listado administrativo y eliminación protegida.
- `products`: CRUD, filtros, ordenamiento y paginación.
- `categories`: CRUD y protección de categorías en uso.
- `orders`: compras transaccionales, stock e historial.
- `files`: validación y carga de imágenes en Cloudinary.

## Endpoints principales

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/auth/signup` | Público |
| POST | `/auth/signin` | Público |
| GET | `/products` | Público |
| POST/PATCH/DELETE | `/products` | Administrador |
| GET | `/categories` | Público |
| POST/PATCH/DELETE | `/categories` | Administrador |
| GET | `/orders` | Usuario autenticado |
| POST | `/orders` | Usuario autenticado |
| GET | `/orders/:id` | Propietario o administrador |
| GET/PATCH | `/users/:id` | Propietario o administrador |
| POST | `/files/uploadImage/:id` | Administrador |

Swagger contiene los cuerpos, parámetros y respuestas completos.

## Usuarios locales de prueba

Con `SEED_TEST_USERS=true` y fuera de producción:

- Usuario: `user@test.local` / `User123!`
- Administrador: `admin@test.local` / `Admin123!`

Nunca habilites este seeder en producción.

## Estructura

```text
src/
├── common/          # Seguridad, pipes, filtros y middleware
├── config/          # Variables de entorno, TypeORM y rate limiting
├── database/        # Entidades, migraciones y seeds
├── modules/         # Auth, users, products, categories, orders y files
├── app.module.ts
└── main.ts
test/                # Pruebas e2e
docs/                # Arquitectura, base de datos y despliegue
```

Consulta [configuración de base de datos](docs/database.md) y
[despliegue](docs/deployment.md) para instrucciones adicionales.

## Seguridad

- Las credenciales viven exclusivamente en `.env` o en el proveedor.
- `synchronize` permanece desactivado; el esquema se administra con migraciones.
- Swagger está deshabilitado por defecto en producción.
- CORS, rate limiting, JWT y validación global están configurados.

## Licencia

[MIT](LICENSE)
