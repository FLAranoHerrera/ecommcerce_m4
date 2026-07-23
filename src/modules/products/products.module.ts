import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../database/entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { SecurityModule } from '../../common/security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    SecurityModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
