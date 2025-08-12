"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfigAsync = void 0;
const config_1 = require("@nestjs/config");
exports.typeOrmConfigAsync = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        const entitiesPath = __dirname + '/../**/*.entity.{js,ts}';
        if (configService.get('DATABASE_URL')) {
            return {
                type: 'postgres',
                url: configService.get('DATABASE_URL'),
                ssl: {
                    rejectUnauthorized: false,
                },
                entities: [entitiesPath],
                synchronize: false,
            };
        }
        else {
            return {
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: parseInt(configService.get('DB_PORT'), 10),
                username: configService.get('DB_USERNAME'),
                password: String(configService.get('DB_PASSWORD') ?? ''),
                database: configService.get('DB_NAME'),
                entities: [entitiesPath],
                synchronize: true,
                logging: true,
            };
        }
    },
};
//# sourceMappingURL=typeorm.config.js.map