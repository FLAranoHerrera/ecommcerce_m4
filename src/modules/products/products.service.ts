import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productsSeed } from '../../database/seeds/products.seed';
import { CategoriesService } from '../categories/categories.service';
import { ProductQueryDto, ProductSortField } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateProductDto) {
    const { categoryId, ...productData } = dto;
    const category = await this.categoriesService.getCategoryById(categoryId);
    const product = this.productsRepository.create({
      ...productData,
      category,
    });
    const saved = await this.productsRepository.save(product);
    return { id: saved.id };
  }

  async findAll(query: ProductQueryDto) {
    const { page, limit, search, category, minPrice, maxPrice, inStock } =
      query;
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new BadRequestException('minPrice no puede ser mayor que maxPrice');
    }

    const builder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      builder.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }
    if (category) {
      builder.andWhere(
        '(CAST(category.id AS text) = :category OR LOWER(category.name) = LOWER(:category))',
        { category },
      );
    }
    if (minPrice !== undefined) {
      builder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      builder.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (inStock !== undefined) {
      builder.andWhere(inStock ? 'product.stock > 0' : 'product.stock = 0');
    }

    const sortColumns: Record<ProductSortField, string> = {
      [ProductSortField.NAME]: 'product.name',
      [ProductSortField.PRICE]: 'product.price',
      [ProductSortField.STOCK]: 'product.stock',
    };
    builder
      .orderBy(sortColumns[query.sortBy], query.order)
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await builder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      const { categoryId, ...productData } = dto;
      const updateData = categoryId
        ? {
            ...productData,
            category: await this.categoriesService.getCategoryById(categoryId),
          }
        : productData;
      const result = await this.productsRepository.update(id, updateData);
      if (result.affected === 0)
        throw new NotFoundException('Producto no encontrado');
      const updated = await this.productsRepository.findOneBy({ id });
      if (!updated)
        throw new NotFoundException('Producto no encontrado tras actualizar');
      return { id: updated.id };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error al actualizar el producto',
      );
    }
  }

  async remove(id: string) {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { id };
  }

  async seedProducts(): Promise<{ message: string }> {
    const created: string[] = [];

    for (const productData of productsSeed) {
      const exists = await this.productsRepository.findOneBy({
        name: productData.name,
      });
      if (!exists) {
        const category = await this.categoriesService.findOrCreateCategory(
          productData.category,
        );

        const product = this.productsRepository.create({
          ...productData,
          category: { id: category.id },
        });

        await this.productsRepository.save(product);
        created.push(product.name);
      }
    }

    return {
      message: `Se cargaron ${created.length} productos.`,
    };
  }
}
