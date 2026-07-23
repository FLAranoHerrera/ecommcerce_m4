import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from '../../database/entities/category.entity';
import { SecurityModule } from '../../common/security/security.module';
import { Product } from '../../database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product]), SecurityModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
