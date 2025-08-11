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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const roles_enum_1 = require("../auth/roles/roles.enum");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("../dto/update-user.dto");
const uuid_pipe_1 = require("../pipes/uuid.pipe");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(page, limit) {
        if (page < 1) {
            throw new common_1.BadRequestException('La página debe ser mayor o igual a 1');
        }
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('El límite debe estar entre 1 y 100');
        }
        return this.usersService.findAll(page, limit);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, dto) {
        return this.usersService.update(id, dto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los usuarios (solo admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Lista de usuarios no obtenida' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'No tiene permisos para acceder a este recurso.' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener usuario por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario' }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        description: 'Datos para actualizar el usuario. Todos los campos son opcionales.',
        examples: {
            ejemplo: {
                summary: 'Ejemplo de actualización',
                value: {
                    name: 'Nuevo nombre',
                    phone: 1234567890,
                    country: 'México',
                    address: 'Calle Falsa 123',
                    city: 'Ciudad de México',
                    admin: false
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario actualizado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar usuario por ID (solo admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario eliminado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado.' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'No tiene permisos para acceder a este recurso.' }),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autorizado. Token JWT inválido o ausente.' }),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map