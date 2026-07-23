import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export const throttleConfig = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
    throttlers: [
      {
        ttl: parseInt(configService.get('RATE_LIMIT_TTL') || '60', 10) * 1000, // en milisegundos
        limit: parseInt(configService.get('RATE_LIMIT_LIMIT') || '100', 10),
      },
    ],
  }),
};
