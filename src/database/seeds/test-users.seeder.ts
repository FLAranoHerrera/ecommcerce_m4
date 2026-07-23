import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class TestUsersSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(TestUsersSeeder.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (
      this.config.get('NODE_ENV') === 'production' ||
      this.config.get('SEED_TEST_USERS') !== 'true'
    ) {
      return;
    }

    await this.upsertTestUser(
      this.config.get('TEST_USER_EMAIL') || 'user@test.local',
      this.config.get('TEST_USER_PASSWORD') || 'User123!',
      false,
      'Usuario de prueba',
    );
    await this.upsertTestUser(
      this.config.get('TEST_ADMIN_EMAIL') || 'admin@test.local',
      this.config.get('TEST_ADMIN_PASSWORD') || 'Admin123!',
      true,
      'Administrador de prueba',
    );
    this.logger.log('Usuarios de prueba preparados');
  }

  private async upsertTestUser(
    email: string,
    password: string,
    admin: boolean,
    name: string,
  ): Promise<void> {
    const existing = await this.users.findOneBy({ email });
    const passwordHash = await bcrypt.hash(password, 10);
    await this.users.save(
      this.users.create({
        ...existing,
        email,
        password: passwordHash,
        admin,
        name,
        birthday: new Date('1990-01-01'),
        phone: '5555555555',
        country: 'México',
        address: 'Dirección de prueba',
        city: 'Ciudad de México',
      }),
    );
  }
}
