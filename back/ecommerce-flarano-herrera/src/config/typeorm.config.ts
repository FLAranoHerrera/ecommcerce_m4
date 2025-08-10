import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmConfigAsync = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    
    const entitiesPath = __dirname + '/../**/*.entity.{js,ts}';

    if (configService.get<string>('DATABASE_URL')) {
      // Producción (Heroku, Railway, etc.)
      return {
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [entitiesPath],
        synchronize: false, // nunca en prod
      };
    } else {
      // Desarrollo o Docker
      return {
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')!, 10),
        username: configService.get<string>('DB_USERNAME'),
        password: String(configService.get('DB_PASSWORD') ?? ''),
        database: configService.get<string>('DB_NAME'),
        entities: [entitiesPath],
        synchronize: true, // en desarrollo sí
        logging: true,
      };
    }
  },
};
