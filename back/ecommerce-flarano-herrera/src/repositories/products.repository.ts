import { Product } from 'src/entities/product.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsRepository {
  constructor(private dataSource: DataSource) {}

  async getProducts(): Promise<Product[]> {
    return this.dataSource.getRepository(Product).find({
      relations: ['category'],
    });
  }

  async addProducts(): Promise<void> {
    const repository = this.dataSource.getRepository(Product);

    const existingProducts = await repository.find();
    if (existingProducts.length > 0) return;

    const defaultCategoryId = 'ac5d7f4d-65ea-4e9c-8aae-a52f3fb807bc'; // ID real de categoría a vincular

    const products: Partial<Product>[] = [
      {
        id: uuidv4(),
        name: 'Camisa básica',
        description: 'Camisa de algodón, cómoda para el día a día.',
        price: 29.99,
        stock: 50,
        imgUrl: '',
        category: { id: defaultCategoryId } as any,
      },
      {
        id: uuidv4(),
        name: 'Pantalón jean',
        description: 'Pantalón de mezclilla azul oscuro.',
        price: 59.99,
        stock: 30,
        imgUrl: '',
        category: { id: defaultCategoryId } as any,
      },
    ];

    await repository.save(products);
  }
}
