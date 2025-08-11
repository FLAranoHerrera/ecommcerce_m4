"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const products_module_1 = require("./products/products.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const orders_module_1 = require("./orders/orders.module");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const files_module_1 = require("./files/files.module");
const typeorm_config_1 = require("./config/typeorm.config");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync(typeorm_config_1.typeOrmConfigAsync),
            products_module_1.ProductsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            orders_module_1.OrdersModule,
            files_module_1.FilesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map