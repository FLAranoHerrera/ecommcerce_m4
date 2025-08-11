"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const files_controller_1 = require("./files.controller");
const files_service_1 = require("./files.service");
const files_repository_1 = require("./files.repository");
const products_module_1 = require("../products/products.module");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const product_entity_1 = require("../entities/product.entity");
const auth_module_1 = require("../auth/auth.module");
let FilesModule = class FilesModule {
};
exports.FilesModule = FilesModule;
exports.FilesModule = FilesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.Product]),
            (0, common_1.forwardRef)(() => products_module_1.ProductsModule),
            cloudinary_module_1.CloudinaryModule, auth_module_1.AuthModule
        ],
        controllers: [files_controller_1.FilesController],
        providers: [files_service_1.FilesService, files_repository_1.FilesRepository],
        exports: [files_service_1.FilesService]
    })
], FilesModule);
//# sourceMappingURL=files.module.js.map