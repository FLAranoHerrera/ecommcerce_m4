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
      console.log('🔗 Configurando conexión a base de datos con DATABASE_URL');
      
      return {
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [entitiesPath],
        synchronize: configService.get<string>('DB_SYNC_ONCE') === 'true',
        logging: configService.get<string>('NODE_ENV') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
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
        synchronize: true, 
        logging: true,
      };
    }
  },
}