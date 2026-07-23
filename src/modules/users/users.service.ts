import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';
import { Order } from '../../database/entities/order.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(signupDto: SignupDto): Promise<User> {
    const { password, email } = signupDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name: signupDto.name,
      birthday: new Date(signupDto.birthday),
      phone: signupDto.phone,
      country: signupDto.country,
      address: signupDto.address,
      city: signupDto.city,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('El usuario ya existe');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 5) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      page,
      limit,
      total,
    };
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    return user;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.preload({ id, ...dto });
    if (!user) throw new NotFoundException('User not found');
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const orderCount = await this.ordersRepository.count({
      where: { user: { id } },
    });
    if (orderCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el usuario porque tiene ${orderCount} orden(es)`,
      );
    }
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { id };
  }

  private isUniqueViolation(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) return false;
    const driverError = error.driverError as { code?: string };
    return driverError.code === '23505';
  }
}
