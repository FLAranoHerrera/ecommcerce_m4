import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/orderDetail.entity';

export const typeOrmConfigAsync = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT')!, 10),
    username: configService.get<string>('DB_USERNAME'),
    password: String(configService.get('DB_PASSWORD') ?? ''),
    database: configService.get<string>('DB_NAME'),
    entities: [User, Product, Category, Order, OrderDetail],
    synchronize: true,
    logging: true,
  }),
};
