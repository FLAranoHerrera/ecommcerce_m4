import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<{
        id: string;
        message: string;
    }>;
    findOne(id: string): Promise<import("../entities/order.entity").Order>;
}
