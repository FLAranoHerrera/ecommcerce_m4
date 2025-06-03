import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController { 
    @Get()
    findAll() {  
        return [ 
            { id: 1, name: 'Ana', email: 'ana@example.com' },
            { id: 2, name: 'Carlos', email: 'carlos@example.com' },
         ];
    }
 }
