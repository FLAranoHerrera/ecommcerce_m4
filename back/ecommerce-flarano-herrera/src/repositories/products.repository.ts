import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  private products: Product[] = [];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    this.products = [
      {
        id: 1,
        name: 'Laptop',
        description: 'High-end laptop',
        price: 1500,
        stock: true,
        imgUrl: 'https://example.com/laptop.jpg',
      },
      {
        id: 2,
        name: 'Phone',
        description: 'Smartphone with OLED screen',
        price: 800,
        stock: false,
        imgUrl: 'https://example.com/phone.jpg',
      },
    ];
  }

  findAll(): Product[] {
    return this.products;
  }
}
