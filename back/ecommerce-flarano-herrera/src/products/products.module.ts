import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    FilesModule,
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
