import { Order } from './order.entity';
import { Product } from './product.entity';
export declare class OrderDetail {
    id: string;
    price: number;
    order: Order;
    products: Product[];
}
