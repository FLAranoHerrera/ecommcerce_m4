import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from '../../database/entities/user.entity';
import { Order } from '../../database/entities/order.entity';

describe('UsersService', () => {
  const queryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };
  const users = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(() => queryBuilder),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };
  const orders = {
    count: jest.fn(),
  };
  const service = new UsersService(
    users as unknown as Repository<User>,
    orders as unknown as Repository<Order>,
  );

  beforeEach(() => jest.clearAllMocks());

  it('normalizes the email and hashes the password when creating a user', async () => {
    const dto = {
      name: 'Test User',
      birthday: '1990-01-02',
      email: '  USER@Test.Local ',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      phone: '5512345678',
      country: 'México',
      address: 'Test street 1',
      city: 'México',
    };
    users.create.mockImplementation((value: User) => value);
    users.save.mockImplementation((value: User) => value);

    const result = await service.create(dto);

    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@test.local',
        birthday: new Date('1990-01-02'),
      }),
    );
    expect(result.password).not.toBe(dto.password);
    await expect(bcrypt.compare(dto.password, result.password)).resolves.toBe(
      true,
    );
  });

  it('translates a PostgreSQL unique violation into a conflict', async () => {
    users.create.mockReturnValue({});
    users.save.mockRejectedValue(
      new QueryFailedError(
        'INSERT',
        [],
        Object.assign(new Error('duplicate'), { code: '23505' }),
      ),
    );

    await expect(
      service.create({
        email: 'user@test.local',
        password: 'Password1!',
        birthday: '1990-01-02',
      } as never),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns paginated users', async () => {
    users.findAndCount.mockResolvedValue([[{ id: 'user-id' }], 6]);

    await expect(service.findAll(2, 5)).resolves.toEqual({
      data: [{ id: 'user-id' }],
      page: 2,
      limit: 5,
      total: 6,
    });
    expect(users.findAndCount).toHaveBeenCalledWith({ skip: 5, take: 5 });
  });

  it('selects the password when finding a user by email', async () => {
    queryBuilder.getOne.mockResolvedValue({ id: 'user-id' });

    await expect(service.findByEmail('USER@test.local')).resolves.toEqual({
      id: 'user-id',
    });
    expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'LOWER(user.email) = LOWER(:email)',
      { email: 'USER@test.local' },
    );
  });

  it('returns a user with orders or rejects a missing user', async () => {
    users.findOne.mockResolvedValueOnce({ id: 'user-id', orders: [] });
    await expect(service.findOne('user-id')).resolves.toMatchObject({
      id: 'user-id',
    });

    users.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates an existing user and rejects a missing one', async () => {
    users.preload.mockResolvedValueOnce({
      id: 'user-id',
      name: 'Updated',
    });
    users.save.mockResolvedValueOnce({ id: 'user-id', name: 'Updated' });
    await expect(
      service.update('user-id', { name: 'Updated' }),
    ).resolves.toMatchObject({ name: 'Updated' });

    users.preload.mockResolvedValueOnce(null);
    await expect(
      service.update('missing', { name: 'Updated' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('prevents deleting users with orders', async () => {
    orders.count.mockResolvedValue(2);

    await expect(service.remove('user-id')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(users.delete).not.toHaveBeenCalled();
  });

  it('deletes users without orders and rejects missing users', async () => {
    orders.count.mockResolvedValue(0);
    users.delete.mockResolvedValueOnce({ affected: 1 });
    await expect(service.remove('user-id')).resolves.toEqual({ id: 'user-id' });

    users.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
