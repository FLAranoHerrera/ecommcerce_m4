"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfigAsync = void 0;
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const order_entity_1 = require("../entities/order.entity");
const orderDetail_entity_1 = require("../entities/orderDetail.entity");
exports.typeOrmConfigAsync = {
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        if (configService.get('DATABASE_URL')) {
            return {
                type: 'postgres',
                url: configService.get('DATABASE_URL'),
                ssl: {
                    rejectUnauthorized: false,
                },
                entities: [user_entity_1.User, product_entity_1.Product, category_entity_1.Category, order_entity_1.Order, orderDetail_entity_1.OrderDetail],
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
                entities: [user_entity_1.User, product_entity_1.Product, category_entity_1.Category, order_entity_1.Order, orderDetail_entity_1.OrderDetail],
                synchronize: true,
                logging: true,
            };
        }
    },
};
//# sourceMappingURL=typeorm.config.js.map