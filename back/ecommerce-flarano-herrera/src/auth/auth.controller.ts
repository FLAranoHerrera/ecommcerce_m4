import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController { 
    @Get()
    getAuthStatus() { 
        return { status: 'Not authenticated' };
     }

 }
