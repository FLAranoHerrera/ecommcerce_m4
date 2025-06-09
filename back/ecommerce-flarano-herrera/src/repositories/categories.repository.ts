import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getCategories(): Promise<Category[]> {
    return this.find();
  }

  async addCategoryIfNotExists(name: string): Promise<Category | null> {
    const exists = await this.findOneBy({ name });
    if (exists) return null;

    const category = this.create({ name });
    return this.save(category);
  }
}
