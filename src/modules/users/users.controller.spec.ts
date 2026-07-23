import { ForbiddenException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../../common/security/auth.guard';

describe('UsersController authorization', () => {
  const usersService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const controller = new UsersController(
    usersService as unknown as UsersService,
  );

  const request = (sub: string, admin = false) =>
    ({ user: { sub, admin } }) as unknown as AuthenticatedRequest;

  beforeEach(() => jest.clearAllMocks());

  it('rejects reading another user', () => {
    expect(() => controller.findOne('other-id', request('own-id'))).toThrow(
      ForbiddenException,
    );
    expect(usersService.findOne).not.toHaveBeenCalled();
  });

  it('allows a user to read their own profile', async () => {
    await controller.findOne('own-id', request('own-id'));
    expect(usersService.findOne).toHaveBeenCalledWith('own-id');
  });

  it('allows an administrator to read another profile', async () => {
    await controller.findOne('other-id', request('admin-id', true));
    expect(usersService.findOne).toHaveBeenCalledWith('other-id');
  });

  it('rejects updating another user', () => {
    expect(() =>
      controller.update('other-id', { name: 'Cambio' }, request('own-id')),
    ).toThrow(ForbiddenException);
    expect(usersService.update).not.toHaveBeenCalled();
  });
});
