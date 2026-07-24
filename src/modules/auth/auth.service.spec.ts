import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  const users = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const jwt = {
    signAsync: jest.fn(),
  };
  const service = new AuthService(
    users as unknown as UsersService,
    jwt as unknown as JwtService,
  );

  beforeEach(() => jest.clearAllMocks());

  it('rejects signup when passwords differ', async () => {
    await expect(
      service.signup({
        email: 'user@test.local',
        password: 'Password1!',
        confirmPassword: 'Password2!',
      } as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects signup when the email already exists', async () => {
    users.findByEmail.mockResolvedValue({ id: 'existing' });
    await expect(
      service.signup({
        email: 'user@test.local',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      } as never),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns public user data after signup', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue({
      id: 'user-id',
      email: 'user@test.local',
      name: 'Test User',
      admin: false,
      password: 'hidden',
    });

    await expect(
      service.signup({
        email: 'user@test.local',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      } as never),
    ).resolves.toEqual({
      id: 'user-id',
      email: 'user@test.local',
      name: 'Test User',
      admin: false,
    });
  });

  it('signs a token for valid credentials', async () => {
    const password = 'Password1!';
    users.findByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@test.local',
      name: 'Test User',
      admin: true,
      password: await bcrypt.hash(password, 4),
    });
    jwt.signAsync.mockResolvedValue('signed-token');

    await expect(
      service.signin({ email: 'user@test.local', password }),
    ).resolves.toMatchObject({
      token: 'signed-token',
      user: { id: 'user-id', admin: true },
    });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@test.local',
      admin: true,
    });
  });

  it('rejects missing users and invalid passwords', async () => {
    users.findByEmail.mockResolvedValueOnce(null);
    await expect(
      service.signin({
        email: 'missing@test.local',
        password: 'Password1!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    users.findByEmail.mockResolvedValueOnce({
      password: await bcrypt.hash('Correct1!', 4),
    });
    await expect(
      service.signin({
        email: 'user@test.local',
        password: 'WrongPass1!',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
