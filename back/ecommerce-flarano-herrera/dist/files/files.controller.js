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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const files_service_1 = require("./files.service");
const max_file_size_pipe_1 = require("../pipes/max-file-size.pipe");
const file_type_pipe_1 = require("../pipes/file-type.pipe");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/roles/roles.guard");
const auth_guard_1 = require("../auth/auth.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const roles_enum_1 = require("../auth/roles/roles.enum");
let FilesController = class FilesController {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    uploadImage(id, file) {
        return this.filesService.uploadProductImage(id, file);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('uploadImage/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Subir imagen de producto (probar en postman)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiBody)({
        description: 'Archivo de imagen a subir',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imagen subida exitosamente.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)(new max_file_size_pipe_1.MaxFileSizePipe(200 * 1024), new file_type_pipe_1.FileTypePipe(['image/jpeg', 'image/png', 'image/webp']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "uploadImage", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('files'),
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map