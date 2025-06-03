import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController { 
    @Get()
    findAll() { 
        return [ 
           { id: 1, name: 'iPhone', price: 30000 },
           { id: 2, name: 'Apple Watch', price: 10000 },
         ];
    }
 }
