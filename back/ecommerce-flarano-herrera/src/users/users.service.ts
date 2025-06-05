import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const newUser = this.usersRepository.create(dto);
    const saved = await this.usersRepository.save(newUser);
    return { id: saved.id };
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



  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.usersRepository.update(id, dto);
    const updated = await this.usersRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('User not found');
    return { id: updated.id };
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { id };
  }
}
