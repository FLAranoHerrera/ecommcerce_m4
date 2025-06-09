import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Get('seeder')
  async seedCategories() {
    return await this.categoriesService.seedCategories();
  }
}
