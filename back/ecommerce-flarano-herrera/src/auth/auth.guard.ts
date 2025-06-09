import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    // Validar estructura: "Basic: email:password"
    const [prefix, credentials] = authHeader.split(' ');
    if (prefix !== 'Basic:' || !credentials || !credentials.includes(':')) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    const [email, password] = credentials.split(':');
    if (!email || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Podríamos inyectar usuario aquí si quisiéramos
    return true;
  }
}
