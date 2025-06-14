import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninDto } from '../dto/singin.dto';
import { SignupDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, password, confirmPassword, ...userData } = dto;

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const { id } = await this.usersService.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    // Obtener el usuario completo
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Error al crear el usuario');
    }

    // Devolver el usuario sin la contraseña
    const { password: _, ...result } = user;
    return result;
  }

  async signin(dto: SigninDto) {
    try {
      const { email, password } = dto;

      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar token JWT
      const payload = { sub: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      // Devolver usuario sin password y el token
      const { password: _, ...userData } = user;
      return {
        user: userData,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}
