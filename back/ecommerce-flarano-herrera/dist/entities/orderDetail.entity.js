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
exports.OrderDetail = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const product_entity_1 = require("./product.entity");
let OrderDetail = class OrderDetail {
    id;
    price;
    order;
    products;
};
exports.OrderDetail = OrderDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order, order => order.orderDetail),
    __metadata("design:type", order_entity_1.Order)
], OrderDetail.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => product_entity_1.Product, product => product.orderDetails),
    __metadata("design:type", Array)
], OrderDetail.prototype, "products", void 0);
exports.OrderDetail = OrderDetail = __decorate([
    (0, typeorm_1.Entity)('order_details')
], OrderDetail);
//# sourceMappingURL=orderDetail.entity.js.map