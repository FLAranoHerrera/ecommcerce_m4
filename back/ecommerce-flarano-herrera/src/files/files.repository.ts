import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity'; 

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async updateProductImage(productId: string, imageUrl: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    product.imgUrl = imageUrl;
    return this.productRepository.save(product);
  }
}
