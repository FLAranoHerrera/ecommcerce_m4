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
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    // La lógica para decidir qué configuración usar
    if (configService.get<string>('DATABASE_URL')) {
      // Opción 1: Usar DATABASE_URL si existe (para producción en Render)
      return {
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false, // Requerido por Render
        },
        entities: [User, Product, Category, Order, OrderDetail],
        synchronize: false, // Considera ponerlo en false en producción a futuro
        logging: true,
      };
    } else {
      // Opción 2: Usar variables individuales si no hay DATABASE_URL (para desarrollo local)
      return {
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')!, 10),
        username: configService.get<string>('DB_USERNAME'),
        password: String(configService.get('DB_PASSWORD') ?? ''),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Product, Category, Order, OrderDetail],
        synchronize: true,
        logging: true,
      };
    }
  },
};
