import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { FilesModule } from './files/files.module';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { throttleConfig } from './config/throttle.config';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ThrottlerModule.forRootAsync(throttleConfig),
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    FilesModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}