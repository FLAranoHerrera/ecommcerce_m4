import { Product } from 'src/entities/product.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsRepository {
  constructor(private dataSource: DataSource) {}

  async getProducts(): Promise<Product[]> {
    return this.dataSource.getRepository(Product).find({
      relations: ['category'],
    });
  }
}
