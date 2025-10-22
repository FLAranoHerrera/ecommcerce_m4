# Guía de Deployment en Render

## Configuración Requerida

### Variables de Entorno Obligatorias

Configura estas variables en el dashboard de Render:

1. **JWT_SECRET**: Clave secreta para firmar tokens JWT
   - Ejemplo: `mi_super_secreto_jwt_2024`

2. **DATABASE_URL**: URL de conexión a PostgreSQL
   - Se configura automáticamente si usas la base de datos de Render

3. **CLOUDINARY_NAME**: Nombre de tu cuenta en Cloudinary
   - Ejemplo: `mi_cuenta_cloudinary`

4. **CLOUDINARY_API_KEY**: API Key de Cloudinary
   - Ejemplo: `123456789012345`

5. **CLOUDINARY_API_SECRET**: API Secret de Cloudinary
   - Ejemplo: `abcdefghijklmnopqrstuvwxyz`

### Variables de Entorno Opcionales

- `RATE_LIMIT_TTL`: Tiempo de vida del rate limit (default: 60)
- `RATE_LIMIT_LIMIT`: Límite de requests por TTL (default: 50)
- `LOG_LEVEL`: Nivel de logging (default: warn)

## Proceso de Deployment

1. **Build**: El script `build.sh` se ejecuta automáticamente
2. **Start**: Se ejecuta `npm run start:prod`
3. **Health Check**: Render verifica el endpoint `/health`

## Troubleshooting

### Si el deployment falla:

1. **Verifica las variables de entorno**:
   ```bash
   ./debug.sh
   ```

2. **Revisa los logs en Render Dashboard**

3. **Problemas comunes**:
   - JWT_SECRET no configurado
   - DATABASE_URL incorrecta
   - Variables de Cloudinary faltantes

### Comandos de Diagnóstico

```bash
# Ejecutar diagnóstico completo
./debug.sh

# Verificar build local
npm run build

# Probar aplicación localmente
npm run start:prod
```

## Estructura del Proyecto

```
├── src/
│   ├── main.ts              # Punto de entrada
│   ├── app.module.ts         # Módulo principal
│   ├── config/              # Configuraciones
│   ├── entities/            # Entidades de base de datos
│   ├── auth/                # Autenticación
│   ├── products/            # Productos
│   ├── orders/              # Órdenes
│   └── files/               # Manejo de archivos
├── build.sh                 # Script de build
├── debug.sh                 # Script de diagnóstico
├── render.yaml              # Configuración de Render
└── package.json             # Dependencias
```

## Endpoints Disponibles

- `GET /` - Información de la API
- `GET /health` - Health check
- `GET /api` - Documentación Swagger
- `POST /auth/signup` - Registro de usuarios
- `POST /auth/signin` - Login
- `GET /products` - Listar productos
- `POST /orders` - Crear orden

## Monitoreo

Render proporciona logs en tiempo real. Revisa:
- Build logs para errores de compilación
- Runtime logs para errores de ejecución
- Health check status
