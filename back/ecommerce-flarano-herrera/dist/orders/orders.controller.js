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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("../dto/create-order.dto");
const uuid_pipe_1 = require("../pipes/uuid.pipe");
const swagger_1 = require("@nestjs/swagger");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(dto) {
        if (!dto.products || dto.products.length === 0) {
            throw new common_1.BadRequestException('La orden debe contener al menos un producto');
        }
        return this.ordersService.addOrder(dto);
    }
    findOne(id) {
        return this.ordersService.getOrder(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear orden de compra' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Orden de compra creada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto con id {id} no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto {name} sin stock disponible' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'El precio del producto {name} no es un número válido' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'El total calculado no es un número válido' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener Ordenes de compra por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ordenes obtenidas exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Orden no encontrada' }),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autorizado. Token JWT inválido o ausente.' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map