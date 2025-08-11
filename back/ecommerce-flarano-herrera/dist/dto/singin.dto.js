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
exports.SigninDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SigninDto {
    email;
    password;
}
exports.SigninDto = SigninDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com',
        format: 'email'
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SigninDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario (8-15 caracteres, debe incluir mayúsculas, minúsculas, números y caracteres especiales)',
        example: 'Password123!',
        minLength: 8,
        maxLength: 15
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(15),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
    }),
    __metadata("design:type", String)
], SigninDto.prototype, "password", void 0);
//# sourceMappingURL=singin.dto.js.map