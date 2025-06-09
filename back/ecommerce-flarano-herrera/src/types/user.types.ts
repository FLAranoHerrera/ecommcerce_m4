import { User } from '../entities/user.entity';

export interface OrderSummary {
  id: string;
  date: Date;
}

export interface UserWithOrders extends Omit<User, 'orders' | 'password'> {
  orders: OrderSummary[];
} 