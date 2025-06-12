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

    // Validar estructura: "Basic base64(email:password)"
    const [prefix, base64Credentials] = authHeader.split(' ');
    if (prefix !== 'Basic' || !base64Credentials) {
      throw new UnauthorizedException('Invalid Authorization format');
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    
    if (!email || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Podríamos inyectar usuario aquí si quisiéramos
    return true;
  }
}
