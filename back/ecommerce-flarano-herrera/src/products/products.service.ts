import { Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/repositories/products.repository';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductsService { 
     constructor(private readonly productsRepository: ProductsRepository) {}

  findAll(): Product[] {
    return this.productsRepository.findAll();
  }
 }
