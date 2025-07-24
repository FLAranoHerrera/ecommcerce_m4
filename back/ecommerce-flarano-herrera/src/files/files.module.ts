import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { ProductsModule } from '../products/products.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Product } from '../entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => ProductsModule),
    CloudinaryModule, AuthModule
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
  exports: [FilesService]
})
export class FilesModule {}
