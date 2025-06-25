import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { productsSeed } from '../seeds/products.seed';
import { CategoriesService } from '../categories/categories.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
    private filesService: FilesService,
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
    try {
      const result = await this.productsRepository.update(id, dto);
      if (result.affected === 0) throw new NotFoundException('Producto no encontrado');
      const updated = await this.productsRepository.findOneBy({ id });
      if (!updated) throw new NotFoundException('Producto no encontrado tras actualizar');
      return { id: updated.id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message || 'Error al actualizar el producto');
    }
  }

  async remove(id: string) {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { id };
  }

  async uploadImage(productId: string, file: Express.Multer.File) {
    return this.filesService.uploadProductImage(productId, file);
  }

  async seedProducts(): Promise<{ message: string }> {
    const created: string[] = [];

    for (const productData of productsSeed) {
      const exists = await this.productsRepository.findOneBy({ name: productData.name });
      if (!exists) {
      
        const category = await this.categoriesService.findOrCreateCategory(productData.category);
        
        const product = this.productsRepository.create({
          ...productData,
          category: { id: category.id }
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
