import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { UserWithOrders } from '../types/user.types';

@Injectable()
export class UsersRepository {
  private users: User[] = [];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    this.users = [
      {
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        password: '123456',
        address: '123 Main St',
        phone: 5551234,
        country: 'USA',
        city: 'New York',
        orders: []
      },
      {
        id: '2',
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: 'abcdef',
        address: '456 Side St',
        phone: 5555678,
        country: 'USA',
        city: 'Los Angeles',
        orders: []
      },
    ];
  }

  findAll(): User[] {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findOneWithOrders(id: string): Promise<UserWithOrders> {
    const user = await this.findOne(id);
    const { password, ...userWithoutPassword } = user;
    
    const orders = user.orders.map(order => ({
      id: order.id,
      date: order.date
    }));

    return {
      ...userWithoutPassword,
      orders
    };
  }

  async addOrder(userId: string, order: Order): Promise<void> {
    const user = await this.findOne(userId);
    user.orders.push(order);
  }
}
