"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const roles_enum_1 = require("../auth/roles/roles.enum");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("../dto/create-product.dto");
const update_product_dto_1 = require("../dto/update-product.dto");
const uuid_pipe_1 = require("../pipes/uuid.pipe");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll(page, limit) {
        if (page < 1) {
            throw new common_1.BadRequestException('La página debe ser mayor o igual a 1');
        }
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('El límite debe estar entre 1 y 100');
        }
        return this.productsService.findAll(page, limit);
    }
    async seedProducts() {
        return await this.productsService.seedProducts();
    }
    create(dto) {
        return this.productsService.create(dto);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, dto) {
        return this.productsService.update(id, dto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener paginado de productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginas obtenidas exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paginas no obtenidas' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('seeder'),
    (0, swagger_1.ApiOperation)({ summary: 'Cargar productos de ejemplo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productos de ejemplo cargados exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Productos no cargados.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "seedProducts", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autorizado. Token JWT inválido o ausente.' }),
    (0, swagger_1.ApiOperation)({ summary: 'Crear productos, (solo admin)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al crear producto' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'No tiene permisos para acceder a este recurso.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autorizado. Token JWT inválido o ausente.' }),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prodcuto obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autorizado. Token JWT inválido o ausente.' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar productos por su ID, (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'No tiene permisos para acceder a este recurso.' }),
    (0, swagger_1.ApiBody)({
        type: update_product_dto_1.UpdateProductDto,
        description: 'Datos para actualizar el producto',
        examples: {
            ejemplo: {
                summary: 'Ejemplo de actualizacion de producto',
                value: {
                    name: 'Nuevo nombre del proudcto',
                    price: 199.99,
                    stock: 100,
                    imgUrl: 'https://example.com/image.jpg',
                    categoryId: '123e4567-e89b-12d3-a456-426614174000'
                }
            }
        }
    }),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autorizado. Token JWT inválido o ausente.' }),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar productos por ID, (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prodcuto eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prodcuto no encontrado' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map