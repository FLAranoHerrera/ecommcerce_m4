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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const swagger_1 = require("@nestjs/swagger");
const uuid_pipe_1 = require("../pipes/uuid.pipe");
let CategoriesController = class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async getCategories() {
        return await this.categoriesService.getCategories();
    }
    async seedCategories() {
        return await this.categoriesService.seedCategories();
    }
    async getCategoryById(id) {
        return await this.categoriesService.getCategoryById(id);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontraron categorías.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('seeder'),
    (0, swagger_1.ApiOperation)({ summary: 'Cargar datos de ejemplo de categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categorías de ejemplo cargadas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se pudieron cargar las categorías de ejemplo.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "seedCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría obtenida exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoria con id {id} no encontrada' }),
    __param(0, (0, common_1.Param)('id', uuid_pipe_1.UuidPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryById", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map