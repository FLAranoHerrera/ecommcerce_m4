import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { ProductsModule } from '../products/products.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Product } from '../entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductsModule,
    CloudinaryModule
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
})
export class FilesModule {}
