import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserWithOrders } from '../types/user.types';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(signupDto: SignupDto): Promise<User> {
    const { password, email, ...userData } = signupDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.usersRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(newUser);
  }

  async findAll(page = 1, limit = 5) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

    return {
      data: usersWithoutPassword,
      page,
      limit,
      total,
    };
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async findOne(id: string): Promise<UserWithOrders> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.usersRepository.update(id, dto);
    const updated = await this.usersRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('User not found');
    return { id: updated.id };
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { id };
  }
}
