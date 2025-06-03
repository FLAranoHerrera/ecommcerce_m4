import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new LoggerMiddleware().use);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
