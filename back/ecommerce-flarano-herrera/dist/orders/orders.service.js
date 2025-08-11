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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../entities/order.entity");
const orderDetail_entity_1 = require("../entities/orderDetail.entity");
const product_entity_1 = require("../entities/product.entity");
const user_entity_1 = require("../entities/user.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    orderDetailsRepository;
    productsRepository;
    usersRepository;
    dataSource;
    constructor(ordersRepository, orderDetailsRepository, productsRepository, usersRepository) {
        this.ordersRepository = ordersRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.productsRepository = productsRepository;
        this.usersRepository = usersRepository;
    }
    async addOrder(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOneBy(user_entity_1.User, { id: dto.userId });
            if (!user) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            const productIds = dto.products.map(p => p.id);
            const productsFromDb = await queryRunner.manager.findBy(product_entity_1.Product, {
                id: (0, typeorm_2.In)(productIds),
            });
            if (productsFromDb.length !== productIds.length) {
                throw new common_1.NotFoundException('Uno o más productos no fueron encontrados');
            }
            let total = 0;
            for (const product of productsFromDb) {
                if (product.stock <= 0) {
                    throw new common_1.BadRequestException(`Producto ${product.name} sin stock disponible`);
                }
                product.stock -= 1;
                total += Number(product.price);
            }
            const order = this.ordersRepository.create({ user, date: new Date() });
            await queryRunner.manager.save(order);
            const orderDetail = this.orderDetailsRepository.create({
                order,
                price: total,
                products: productsFromDb,
            });
            await queryRunner.manager.save(orderDetail);
            await queryRunner.manager.save(productsFromDb);
            await queryRunner.commitTransaction();
            return {
                id: order.id,
                message: "Orden creada exitosamente"
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getOrder(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['orderDetail', 'orderDetail.products', 'user'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Orden no encontrada');
        }
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(orderDetail_entity_1.OrderDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map