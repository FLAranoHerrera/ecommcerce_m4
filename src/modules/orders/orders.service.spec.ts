import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from '../../database/entities/order.entity';
import { OrderDetail } from '../../database/entities/order-detail.entity';
import { Product } from '../../database/entities/product.entity';
import { User } from '../../database/entities/user.entity';

describe('OrdersService', () => {
  const ordersQuery = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const orders = {
    createQueryBuilder: jest.fn(() => ordersQuery),
    findOne: jest.fn(),
    create: jest.fn((value: Partial<Order>) => ({ id: 'order-id', ...value })),
  };
  const details = {
    create: jest.fn((value: Partial<OrderDetail>) => value),
  };
  const products = {};
  const users = {};
  const runner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    },
  };
  const dataSource = {
    createQueryRunner: jest.fn((): typeof runner => runner),
  };
  const service = new OrdersService(
    dataSource as unknown as DataSource,
    orders as unknown as Repository<Order>,
    details as unknown as Repository<OrderDetail>,
    products as unknown as Repository<Product>,
    users as unknown as Repository<User>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    for (const method of [
      'leftJoinAndSelect',
      'orderBy',
      'addOrderBy',
      'skip',
      'take',
      'andWhere',
    ] as const) {
      ordersQuery[method].mockReturnThis();
    }
  });

  it('scopes order history to regular users', async () => {
    ordersQuery.getManyAndCount.mockResolvedValue([[], 0]);
    await expect(
      service.findAll('user-id', false, { page: 1, limit: 10 }),
    ).resolves.toMatchObject({ total: 0, page: 1 });
    expect(ordersQuery.andWhere).toHaveBeenCalledWith('user.id = :userId', {
      userId: 'user-id',
    });
  });

  it('allows an admin to read any order and rejects foreign access', async () => {
    orders.findOne.mockResolvedValue({ id: 'order-id', user: { id: 'owner' } });
    await expect(
      service.getOrder('order-id', 'admin', true),
    ).resolves.toMatchObject({ id: 'order-id' });
    await expect(
      service.getOrder('order-id', 'other-user', false),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('reports an unknown order', async () => {
    orders.findOne.mockResolvedValue(null);
    await expect(
      service.getOrder('missing', 'user-id', false),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rolls back duplicated product requests', async () => {
    runner.manager.findOneBy.mockResolvedValue({ id: 'user-id' });
    await expect(
      service.addOrder('user-id', {
        products: [
          { id: 'product-id', quantity: 1 },
          { id: 'product-id', quantity: 2 },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(runner.rollbackTransaction).toHaveBeenCalled();
    expect(runner.release).toHaveBeenCalled();
  });
});
