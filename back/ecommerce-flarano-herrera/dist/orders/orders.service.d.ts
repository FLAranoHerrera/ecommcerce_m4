import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/orderDetail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
export declare class OrdersService {
    private ordersRepository;
    private orderDetailsRepository;
    private productsRepository;
    private usersRepository;
    dataSource: any;
    constructor(ordersRepository: Repository<Order>, orderDetailsRepository: Repository<OrderDetail>, productsRepository: Repository<Product>, usersRepository: Repository<User>);
    addOrder(dto: CreateOrderDto): Promise<{
        id: string;
        message: string;
    }>;
    getOrder(id: string): Promise<Order>;
}
