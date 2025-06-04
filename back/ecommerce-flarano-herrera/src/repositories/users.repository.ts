import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  private users: User[] = [];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    this.users = [
      {
        id: 1,
        email: 'john@example.com',
        name: 'John Doe',
        password: '123456',
        address: '123 Main St',
        phone: '555-1234',
        country: 'USA',
        city: 'New York',
      },
      {
        id: 2,
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: 'abcdef',
        address: '456 Side St',
        phone: '555-5678',
        country: 'USA',
        city: 'Los Angeles',
      },
    ];
  }

  findAll(): User[] {
    return this.users;
  }
}
