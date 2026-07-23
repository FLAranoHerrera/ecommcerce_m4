import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../database/entities/category.entity';
import { Repository } from 'typeorm';
import { categoriesSeed } from '../../database/seeds/categories.seed';
import { Product } from '../../database/entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    await this.ensureNameAvailable(dto.name);
    return this.categoryRepository.save(this.categoryRepository.create(dto));
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryById(id);
    if (dto.name && dto.name !== category.name) {
      await this.ensureNameAvailable(dto.name, id);
      category.name = dto.name;
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<{ id: string; message: string }> {
    const category = await this.getCategoryById(id);
    const productCount = await this.productRepository.count({
      where: { category: { id } },
    });
    if (productCount > 0) {
      throw new ConflictException(
        `No se puede eliminar la categoría porque tiene ${productCount} producto(s) asociado(s)`,
      );
    }
    await this.categoryRepository.remove(category);
    return { id, message: 'Categoría eliminada exitosamente' };
  }

  async seedCategories(): Promise<{ message: string }> {
    const created: string[] = [];

    for (const categoryData of categoriesSeed) {
      const exists = await this.categoryRepository.findOneBy({
        name: categoryData.name,
      });
      if (!exists) {
        const category = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(category);
        created.push(category.name);
      }
    }

    return {
      message: `Se cargaron ${created.length} categorías.`,
    };
  }

  async findOrCreateCategory(name: string): Promise<Category> {
    const normalizedName = name.trim().toLowerCase();
    let category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = :name', { name: normalizedName })
      .getOne();

    if (!category) {
      category = this.categoryRepository.create({ name: normalizedName });
      await this.categoryRepository.save(category);
    }

    return category;
  }
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Categoria con id ${id} no encontrada`);
    }
    return category;
  }

  private async ensureNameAvailable(name: string, excludedId?: string) {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name });
    if (excludedId) {
      query.andWhere('category.id != :excludedId', { excludedId });
    }
    if (await query.getOne()) {
      throw new ConflictException(`La categoría '${name}' ya existe`);
    }
  }
}
