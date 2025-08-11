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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const singin_dto_1 = require("../dto/singin.dto");
const signup_dto_1 = require("../dto/signup.dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signin(dto) {
        return this.authService.signin(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario registrado exitosamente',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'usuario@ejemplo.com',
                name: 'Usuario Ejemplo',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de registro inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El email ya está registrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sesión' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inicio de sesión exitoso',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'usuario@ejemplo.com',
                name: 'Usuario Ejemplo',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Credenciales inválidas' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [singin_dto_1.SigninDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map