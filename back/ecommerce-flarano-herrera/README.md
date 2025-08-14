<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

API de E-commerce desarrollada con [NestJS](https://github.com/nestjs/nest) framework TypeScript.

### Características Implementadas

- 🔐 **Autenticación JWT** con roles y permisos
- 👥 **Gestión de usuarios** con validación robusta
- 🛍️ **Catálogo de productos** con paginación
- 📦 **Sistema de órdenes** de compra
- 🗂️ **Categorías** de productos
- 📁 **Manejo de archivos** con Cloudinary
- 🛡️ **Rate limiting** para prevenir ataques
- 📝 **Logging estructurado** con NestJS Logger
- 🔍 **Validación de entorno** con class-validator
- 🚨 **Manejo global de errores** personalizado
- 📚 **Documentación automática** con Swagger

### Variables de Entorno Requeridas

Copia el archivo `env.example` a `.env` y configura las siguientes variables:

```bash
# Configuración de la aplicación
PORT=3000
NODE_ENV=development

# Configuración de JWT (OBLIGATORIA)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Configuración de base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce

# Configuración de Cloudinary (opcional)
CLOUDINARY_NAME=tu_cloudinary_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret

# Configuración de rate limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

## Project setup

```bash
$ npm install
```

## 🐳 Docker

### Desarrollo local con Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down
```

### Construir imagen Docker

```bash
# Construir imagen
docker build -t ecommerce-flarano-herrera .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.docker ecommerce-flarano-herrera
```

## 🚀 Deploy en Render

### Opción 1: Deploy automático con render.yaml

1. Conecta tu repositorio de GitHub a Render
2. Render detectará automáticamente el archivo `render.yaml`
3. Configura las variables de entorno en el dashboard de Render:
   - `JWT_SECRET` (obligatorio)
   - `CLOUDINARY_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Opción 2: Deploy manual

1. Crea un nuevo **Web Service** en Render
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build Command**: `./build.sh`
   - **Start Command**: `npm run start:prod`
   - **Environment**: `Node`
4. Configura las variables de entorno
5. Conecta una base de datos PostgreSQL

### Variables de entorno en Render

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de la aplicación | `production` |
| `PORT` | Puerto de la aplicación | `3000` |
| `JWT_SECRET` | Secret para JWT (OBLIGATORIO) | `tu_secret_aqui` |
| `DATABASE_URL` | URL de la base de datos | `postgresql://...` |
| `CLOUDINARY_NAME` | Nombre de Cloudinary | `tu_cloudinary_name` |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | `tu_api_key` |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | `tu_api_secret` |
| `RATE_LIMIT_TTL` | Tiempo para rate limiting | `60` |
| `RATE_LIMIT_LIMIT` | Límite de requests | `50` |
| `LOG_LEVEL` | Nivel de logging | `warn` |

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
