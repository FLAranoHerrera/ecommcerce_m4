import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmConfigAsync = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const entitiesPath = __dirname + '/../database/entities/*.entity.{js,ts}';
    const migrationsPath = __dirname + '/../database/migrations/*.{js,ts}';

    if (configService.get<string>('DATABASE_URL')) {
      console.log('🔗 Configurando conexión a base de datos con DATABASE_URL');

      return {
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl:
          configService.get<string>('DB_SSL') === 'false'
            ? false
            : { rejectUnauthorized: true },
        entities: [entitiesPath],
        migrations: [migrationsPath],
        migrationsRun:
          configService.get<string>('DB_MIGRATIONS_RUN') === 'true',
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
      };
    } else {
      // Desarrollo o Docker
      return {
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT') ?? 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: String(configService.get('DB_PASSWORD') ?? ''),
        database: configService.get<string>('DB_NAME'),
        entities: [entitiesPath],
        migrations: [migrationsPath],
        migrationsRun:
          configService.get<string>('DB_MIGRATIONS_RUN') === 'true',
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
      };
    }
  },
};
