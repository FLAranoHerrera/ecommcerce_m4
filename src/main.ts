import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicación NestJS...');
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Puerto: ${process.env.PORT || 3000}`);

    const app = await NestFactory.create(AppModule);

    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim());
    app.enableCors({ origin: allowedOrigins, credentials: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    const swaggerConfig = new DocumentBuilder()
      .setTitle('E-commerce Proyecto M4')
      .setDescription('API para el e-commerce de Frank')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingresa tu token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.ENABLE_SWAGGER === 'true'
    ) {
      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
          persistAuthorization: true,
        },
        customSiteTitle: 'Documentación del Ecommerce M4',
      });
    }

    await app.listen(process.env.PORT ?? 3000);
    console.log(
      `✅ Aplicación ejecutándose en puerto ${process.env.PORT ?? 3000}`,
    );
    console.log(
      `📚 Documentación disponible en: http://localhost:${process.env.PORT ?? 3000}/api`,
    );
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

void bootstrap();
