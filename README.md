# 🛒 E-commerce API - Proyecto M4

Una API REST completa para un sistema de e-commerce desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**.

## 🚀 Características

- ✅ **Autenticación JWT** con roles (Admin/User)
- ✅ **Gestión de productos** con paginación y filtros
- ✅ **Sistema de categorías** 
- ✅ **Gestión de usuarios** completa
- ✅ **Sistema de órdenes** y detalles de compra
- ✅ **Subida de imágenes** con Cloudinary
- ✅ **Validación de datos** con class-validator
- ✅ **Documentación automática** con Swagger
- ✅ **Rate limiting** para protección
- ✅ **Logging** completo
- ✅ **Docker** para contenedorización
- ✅ **Deploy en Render** con base de datos Neon

## 🛠️ Tecnologías

- **Backend**: NestJS, TypeScript
- **Base de datos**: PostgreSQL (Neon)
- **ORM**: TypeORM
- **Autenticación**: JWT
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Storage**: Cloudinary
- **Deploy**: Render
- **Contenedores**: Docker

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (o usar Neon)
- Cuenta de Cloudinary (opcional)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/frank-larano/PM4BE-FLAranoHerrera.git
cd PM4BE-FLAranoHerrera/back/ecommerce-flarano-herrera
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto backend:

```env
# Base de datos
DATABASE_URL=postgresql://username:password@hostname:port/database
# O para desarrollo local:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=ecommerce

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# Cloudinary (opcional)
CLOUDINARY_NAME=tu_cloudinary_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=50

# Puerto
PORT=3000
```

### 4. Ejecutar la aplicación

#### Desarrollo
```bash
npm run start:dev
```

#### Producción
```bash
npm run build
npm run start:prod
```

#### Con Docker
```bash
docker-compose up -d
```

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

- **Local**: http://localhost:3000/api
- **Producción**: https://ecommerce-flarano-herrera.onrender.com/api

## 🔐 Autenticación

La API utiliza JWT para autenticación. Para acceder a endpoints protegidos:

1. **Registrarse**: `POST /auth/signup`
2. **Iniciar sesión**: `POST /auth/signin`
3. **Usar el token**: Incluir `Authorization: Bearer <token>` en las peticiones

### Ejemplo de registro:
```json
POST /auth/signup
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Usuario Ejemplo"
}
```

## 📊 Endpoints principales

### 🔐 Autenticación
- `POST /auth/signup` - Registro de usuario
- `POST /auth/signin` - Inicio de sesión

### 👥 Usuarios
- `GET /users` - Listar usuarios (Admin)
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario (Admin)

### 🛍️ Productos
- `GET /products` - Listar productos (paginado)
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear producto (Admin)
- `PUT /products/:id` - Actualizar producto (Admin)
- `DELETE /products/:id` - Eliminar producto (Admin)
- `GET /products/seeder` - Cargar productos de ejemplo

### 📂 Categorías
- `GET /categories` - Listar categorías
- `GET /categories/:id` - Obtener categoría por ID
- `GET /categories/seeder` - Cargar categorías de ejemplo

### 🛒 Órdenes
- `POST /orders` - Crear orden de compra
- `GET /orders/:id` - Obtener orden por ID

### 📁 Archivos
- `POST /files/uploadImage/:id` - Subir imagen de producto (Admin)

## 🗄️ Estructura de la base de datos

### Entidades principales:
- **Users**: Información de usuarios
- **Products**: Catálogo de productos
- **Categories**: Categorías de productos
- **Orders**: Órdenes de compra
- **OrderDetails**: Detalles de cada orden

## 🚀 Deploy en Render

### 1. Configurar base de datos en Neon
1. Crear cuenta en [Neon](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar la connection string

### 2. Deploy en Render
1. Conectar repositorio de GitHub
2. Configurar variables de entorno:
   - `DATABASE_URL`: URL de Neon
   - `JWT_SECRET`: Tu secret JWT
   - `DB_SYNC_ONCE`: `true` (solo para inicializar)
3. Deploy automático

### 3. Inicializar base de datos
1. Activar `DB_SYNC_ONCE=true` en Render
2. Redeploy (crea las tablas)
3. Ejecutar seeds:
   - `GET /categories/seeder`
   - `GET /products/seeder`
4. Desactivar `DB_SYNC_ONCE=false`
5. Redeploy final

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Scripts disponibles

```bash
npm run start          # Iniciar en producción
npm run start:dev      # Iniciar en desarrollo
npm run start:debug    # Iniciar en modo debug
npm run build          # Compilar para producción
npm run test           # Ejecutar tests
npm run test:e2e       # Ejecutar tests e2e
npm run test:cov       # Coverage de tests
npm run lint           # Linter
npm run format         # Formatear código
```

## 🔧 Configuración de desarrollo

### Estructura del proyecto:
```
PM4BE-FLAranoHerrera/
├── back/
│   └── ecommerce-flarano-herrera/
│       ├── src/
│       │   ├── auth/              # Autenticación y autorización
│       │   ├── categories/        # Gestión de categorías
│       │   ├── config/           # Configuraciones
│       │   ├── dto/              # Data Transfer Objects
│       │   ├── entities/         # Entidades de TypeORM
│       │   ├── files/            # Gestión de archivos
│       │   ├── filters/          # Filtros de excepciones
│       │   ├── middlewares/      # Middlewares personalizados
│       │   ├── orders/           # Sistema de órdenes
│       │   ├── pipes/            # Pipes de validación
│       │   ├── products/         # Gestión de productos
│       │   ├── seeds/            # Datos de ejemplo
│       │   ├── types/            # Tipos TypeScript
│       │   └── users/            # Gestión de usuarios
│       ├── package.json
│       ├── docker-compose.yml
│       └── README.md
└── README.md (este archivo)
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Frank Larano Herrera**
- GitHub: [@FLAranoHerrera](https://github.com/FLAranoHerrera)
- LinkedIn: [Francisco Leonardo Arano Herrera](https://www.linkedin.com/in/francisco-leonardo-arano-herrera-540198169)
- Email: aranoherrera92@gmail.com

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [TypeORM](https://typeorm.io/) - ORM para TypeScript
- [Neon](https://neon.tech/) - Base de datos PostgreSQL serverless
- [Render](https://render.com/) - Plataforma de deploy
- [Cloudinary](https://cloudinary.com/) - Gestión de imágenes

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐
