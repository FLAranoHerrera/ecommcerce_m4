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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const files_repository_1 = require("./files.repository");
const streamifier = require("streamifier");
let FilesService = class FilesService {
    filesRepository;
    cloudinaryClient;
    constructor(filesRepository, cloudinaryClient) {
        this.filesRepository = filesRepository;
        this.cloudinaryClient = cloudinaryClient;
    }
    async uploadProductImage(productId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún archivo');
        }
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = this.cloudinaryClient.uploader.upload_stream({
                folder: 'products',
                resource_type: 'image',
            }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('No se recibió respuesta de Cloudinary'));
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
        const updatedProduct = await this.filesRepository.updateProductImage(productId, uploadResult.secure_url);
        return {
            message: 'Imagen cargada y producto actualizado exitosamente',
            imageUrl: uploadResult.secure_url,
            product: updatedProduct,
        };
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('CLOUDINARY')),
    __metadata("design:paramtypes", [files_repository_1.FilesRepository, Object])
], FilesService);
//# sourceMappingURL=files.service.js.map