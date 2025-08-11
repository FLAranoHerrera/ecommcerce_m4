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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const products_seed_1 = require("../seeds/products.seed");
const categories_service_1 = require("../categories/categories.service");
let ProductsService = class ProductsService {
    productsRepository;
    categoriesService;
    constructor(productsRepository, categoriesService) {
        this.productsRepository = productsRepository;
        this.categoriesService = categoriesService;
    }
    async create(dto) {
        const product = this.productsRepository.create(dto);
        const saved = await this.productsRepository.save(product);
        return { id: saved.id };
    }
    async findAll(page = 1, limit = 5) {
        const [products, total] = await this.productsRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: products,
            page,
            limit,
            total,
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, dto) {
        try {
            const result = await this.productsRepository.update(id, dto);
            if (result.affected === 0)
                throw new common_1.NotFoundException('Producto no encontrado');
            const updated = await this.productsRepository.findOneBy({ id });
            if (!updated)
                throw new common_1.NotFoundException('Producto no encontrado tras actualizar');
            return { id: updated.id };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException(error.message || 'Error al actualizar el producto');
        }
    }
    async remove(id) {
        const result = await this.productsRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Product not found');
        return { id };
    }
    async seedProducts() {
        const created = [];
        for (const productData of products_seed_1.productsSeed) {
            const exists = await this.productsRepository.findOneBy({ name: productData.name });
            if (!exists) {
                const category = await this.categoriesService.findOrCreateCategory(productData.category);
                const product = this.productsRepository.create({
                    ...productData,
                    category: { id: category.id }
                });
                await this.productsRepository.save(product);
                created.push(product.name);
            }
        }
        return {
            message: `Se cargaron ${created.length} productos.`,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map