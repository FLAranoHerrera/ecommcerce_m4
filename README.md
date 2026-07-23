# E-commerce API

[![Backend CI](https://github.com/FLAranoHerrera/ecommcerce_m4/actions/workflows/ci.yml/badge.svg)](https://github.com/FLAranoHerrera/ecommcerce_m4/actions/workflows/ci.yml)

API REST de comercio electrónico construida con NestJS 11, TypeORM,
PostgreSQL, JWT y Cloudinary. Incluye gestión de usuarios, productos,
categorías, imágenes y compras transaccionales con control de inventario.

## Estado del proyecto

- API de producción:
  [ecommerce-flarano-herrera.onrender.com](https://ecommerce-flarano-herrera.onrender.com)
- Health check:
  [ecommerce-flarano-herrera.onrender.com/health](https://ecommerce-flarano-herrera.onrender.com/health)
- Swagger de producción:
  [ecommerce-flarano-herrera.onrender.com/api](https://ecommerce-flarano-herrera.onrender.com/api)
  (disponible cuando `ENABLE_SWAGGER=true`)
- Base de producción: PostgreSQL administrado por Neon.
- Despliegue: contenedor Docker en Render desde la rama `main`.
- Integración continua: GitHub Actions en `main`, `develop` y sus pull
  requests.

## Tecnologías

- Node.js 22
- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL 16
- JSON Web Tokens
- Cloudinary
- Swagger / OpenAPI
- Docker y Docker Compose
- Jest y Supertest
- GitHub Actions
- Render y Neon

## Requisitos

- Node.js 20 o superior; se recomienda Node.js 22.
- npm.
- Docker Desktop para el entorno contenerizado.
- PostgreSQL 16 local o mediante Docker.
- Cuenta de Cloudinary si se probará la carga de imágenes.

## Inicio rápido con Docker

Desde la raíz del repositorio:

```bash
cp .env.example .env
```

Configura como mínimo `DB_PASSWORD` y un `JWT_SECRET` de al menos 32
caracteres. Después ejecuta:

```bash
docker compose up -d --build
docker compose ps
```

Servicios locales:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`
- PostgreSQL desde el host: `localhost:5433`
- Base: `ecommerce`
- Usuario: `postgres`

Docker aplica automáticamente las migraciones pendientes. El volumen
`postgres-data` conserva la información entre reinicios.

## Desarrollo local

```bash
cp .env.example .env
npm ci
npm run migration:run
npm run start:dev
```

Todos los comandos se ejecutan desde la raíz, donde se encuentra
`package.json`.

Si Node se ejecuta en el host y PostgreSQL está dentro de Docker, configura
`DB_HOST=localhost` y `DB_PORT=5433`.

## Variables de entorno

Consulta [.env.example](.env.example) para ver el contrato completo.

| Variable | Propósito |
|---|---|
| `JWT_SECRET` | Firma y validación de tokens |
| `DATABASE_URL` | Conexión única, usada principalmente con Neon |
| `DB_HOST`, `DB_PORT` | Servidor PostgreSQL local |
| `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Credenciales PostgreSQL locales |
| `DB_SSL` | Habilita TLS para proveedores externos |
| `DB_MIGRATIONS_RUN` | Ejecuta migraciones al iniciar |
| `CLOUDINARY_NAME` | Entorno de Cloudinary |
| `CLOUDINARY_API_KEY` | Identificador de la API de Cloudinary |
| `CLOUDINARY_API_SECRET` | Secreto de Cloudinary |
| `CORS_ORIGINS` | Orígenes permitidos, separados por comas |
| `RATE_LIMIT_TTL`, `RATE_LIMIT_LIMIT` | Ventana y límite de solicitudes |
| `ENABLE_SWAGGER` | Habilita Swagger en producción |
| `SEED_TEST_USERS` | Crea usuarios locales de prueba fuera de producción |

No confirmes archivos `.env` ni credenciales reales en Git.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Servidor local con recarga |
| `npm run build` | Compila la aplicación |
| `npm run start:prod` | Ejecuta `dist/main.js` |
| `npm run lint` | Analiza el código sin modificarlo |
| `npm run lint:fix` | Corrige problemas compatibles con ESLint |
| `npm test` | Ejecuta pruebas unitarias |
| `npm run test:e2e` | Ejecuta pruebas de extremo a extremo |
| `npm run test:cov` | Genera cobertura de pruebas |
| `npm run migration:show` | Muestra el estado de migraciones |
| `npm run migration:run` | Aplica migraciones pendientes |
| `npm run migration:revert` | Revierte la migración más reciente |

## Módulos

- `auth`: registro, inicio de sesión y emisión de JWT.
- `users`: perfiles, consulta administrativa y eliminación protegida.
- `products`: CRUD, filtros, ordenamiento, paginación e inventario.
- `categories`: CRUD y protección de categorías asociadas a productos.
- `orders`: compras transaccionales, partidas, stock e historial.
- `files`: validación y carga de imágenes en Cloudinary.

## Endpoints principales

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/` | Público |
| `GET` | `/health` | Público |
| `POST` | `/auth/signup` | Público |
| `POST` | `/auth/signin` | Público |
| `GET` | `/products` | Público |
| `GET` | `/products/:id` | Autenticado |
| `POST` | `/products` | Administrador |
| `PUT` | `/products/:id` | Administrador |
| `DELETE` | `/products/:id` | Administrador |
| `GET` | `/categories` | Público |
| `GET` | `/categories/:id` | Público |
| `POST` | `/categories` | Administrador |
| `PATCH` | `/categories/:id` | Administrador |
| `DELETE` | `/categories/:id` | Administrador |
| `GET` | `/orders` | Autenticado |
| `GET` | `/orders/:id` | Propietario o administrador |
| `POST` | `/orders` | Autenticado |
| `GET` | `/users` | Administrador |
| `GET` | `/users/:id` | Propietario o administrador |
| `PATCH` | `/users/:id` | Propietario o administrador |
| `DELETE` | `/users/:id` | Administrador |
| `POST` | `/files/uploadImage/:id` | Administrador |

Swagger documenta cuerpos, filtros, parámetros, códigos de estado y respuestas.

## Filtros y paginación

`GET /products` admite:

- `page` y `limit`.
- `search`.
- `category`, por nombre o UUID.
- `minPrice` y `maxPrice`.
- `inStock`.
- `sortBy`: `name`, `price` o `stock`.
- `order`: `ASC` o `DESC`.

`GET /orders` admite `page` y `limit`. Un usuario consulta únicamente sus
órdenes; un administrador puede consultar todas.

## Usuarios locales de prueba

Con `SEED_TEST_USERS=true` y `NODE_ENV` distinto de `production`:

| Rol | Correo | Contraseña |
|---|---|---|
| Usuario | `user@test.local` | `User123!` |
| Administrador | `admin@test.local` | `Admin123!` |

El seeder es idempotente y nunca se ejecuta en producción.

## Arquitectura

```text
src/
├── common/
│   ├── filters/
│   ├── middleware/
│   ├── pipes/
│   └── security/
├── config/
├── database/
│   ├── entities/
│   ├── migrations/
│   └── seeds/
├── modules/
│   ├── auth/
│   ├── categories/
│   ├── files/
│   ├── orders/
│   ├── products/
│   └── users/
├── app.controller.ts
├── app.module.ts
└── main.ts
```

Los módulos contienen controladores, servicios y DTO propios. La seguridad
compartida vive en `common/security`; las entidades y migraciones permanecen en
`database`.

Consulta también:

- [Diagrama de arquitectura](docs/architecture.svg)
- [Base de datos y migraciones](docs/database.md)
- [Despliegue en Render y Docker](docs/deployment.md)

## Base de datos

El esquema se administra exclusivamente mediante migraciones;
`synchronize=false` en todos los entornos.

El flujo de compra:

1. Autentica al usuario mediante JWT.
2. Bloquea los productos solicitados dentro de una transacción.
3. Valida existencia y stock.
4. Crea la orden, su detalle y sus partidas.
5. Descuenta existencias.
6. Confirma todos los cambios o revierte la operación completa.

La migración de compatibilidad incluida adapta instalaciones creadas con el
modelo antiguo de órdenes sin recrear usuarios, productos ni categorías.

## Seguridad

- Contraseñas almacenadas con bcrypt.
- JWT validado mediante guard compartido.
- Autorización por propietario y roles.
- Validación y transformación global de DTO.
- Rate limiting global.
- CORS configurable.
- Límites de tamaño y tipo para imágenes.
- Secretos fuera del repositorio.
- Migraciones automáticas configurables.
- Swagger deshabilitable en producción.

## Pruebas e integración continua

Antes de abrir un pull request:

```bash
npm run lint
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

GitHub Actions ejecuta estas comprobaciones en pushes y pull requests dirigidos
a `develop` o `main`.

## Flujo de ramas

- `main`: versión desplegable en producción.
- `develop`: integración de las siguientes mejoras.
- `codex/*`: ramas cortas para cada cambio.

Los cambios entran mediante pull request:

```text
codex/* → develop → main → Render
```

## Despliegue

Render construye la imagen mediante el `Dockerfile` ubicado en la raíz y
ejecuta `node dist/main.js`. Producción utiliza:

- Render para la aplicación.
- Neon para PostgreSQL.
- Cloudinary para imágenes.
- `/health` como health check.

Consulta [docs/deployment.md](docs/deployment.md) antes de modificar variables,
migraciones o el servicio productivo.

## Licencia

Este proyecto se distribuye bajo la [licencia MIT](LICENSE).
