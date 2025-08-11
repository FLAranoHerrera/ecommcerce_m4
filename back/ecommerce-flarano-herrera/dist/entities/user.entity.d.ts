import { Order } from './order.entity';
export declare class User {
    id: string;
    name: string;
    birthday: Date;
    email: string;
    password: string;
    phone: number;
    country: string;
    address: string;
    city: string;
    admin: boolean;
    orders: Order[];
}
