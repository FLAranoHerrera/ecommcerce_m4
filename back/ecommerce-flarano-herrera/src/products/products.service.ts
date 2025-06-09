import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productsRepository.create(dto);
    const saved = await this.productsRepository.save(product);
    return { id: saved.id };
  }

  async findAll(page = 1, limit = 5) {
  const [products, total] = await this.productsRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data: products,
    page,
    limit,
    total,
  };
}


  async findOne(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.productsRepository.update(id, dto);
    const updated = await this.productsRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('Product not found');
    return { id: updated.id };
  }

  async remove(id: string) {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { id };
  }
}
