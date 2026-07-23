import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { FilesModule } from './modules/files/files.module';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { throttleConfig } from './config/throttle.config';
import { validate } from './config/env.validation';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

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
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
