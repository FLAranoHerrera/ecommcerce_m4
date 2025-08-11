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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        const { email, password, confirmPassword, ...userData } = dto;
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException('Las contraseñas no coinciden');
        }
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException('El usuario ya existe');
        }
        const user = await this.usersService.create(dto);
        const { password: _, ...result } = user;
        return result;
    }
    async signin(dto) {
        try {
            const { email, password } = dto;
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                admin: user.admin
            };
            const token = await this.jwtService.signAsync(payload);
            const { password: _, ...userData } = user;
            return {
                user: userData,
                token,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map