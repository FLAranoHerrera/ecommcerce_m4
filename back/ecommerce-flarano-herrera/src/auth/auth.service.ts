import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninDto } from '../dto/singin.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signin(dto: SigninDto) {
    const { email, password } = dto;

    const user = await this.usersService.findByEmail(email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Email o password incorrectos');
    }

    // Devuelve usuario sin password
    const { password: _, ...userData } = user;
    return userData;
  }
}
