import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { categoriesSeed } from '../seeds/categories.seed';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async seedCategories(): Promise<{ message: string }> {
    const created: string[] = [];

    for (const categoryData of categoriesSeed) {
      const exists = await this.categoryRepository.findOneBy({ name: categoryData.name });
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
}
