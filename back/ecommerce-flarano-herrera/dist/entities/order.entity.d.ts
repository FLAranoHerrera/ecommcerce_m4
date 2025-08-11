import { User } from './user.entity';
import { OrderDetail } from './orderDetail.entity';
export declare class Order {
    id: string;
    date: Date;
    user: User;
    orderDetail: OrderDetail;
}
