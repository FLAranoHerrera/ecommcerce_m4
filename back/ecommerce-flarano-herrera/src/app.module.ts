import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { FilesModule } from './files/files.module';
import { typeOrmConfigAsync } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
    
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    FilesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}