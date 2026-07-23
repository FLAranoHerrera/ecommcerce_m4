import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../database/entities/user.entity';
import { SecurityModule } from '../../common/security/security.module';
import { TestUsersSeeder } from '../../database/seeds/test-users.seeder';
import { Order } from '../../database/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order]), SecurityModule],
  controllers: [UsersController],
  providers: [UsersService, TestUsersSeeder],
  exports: [UsersService],
})
export class UsersModule {}
