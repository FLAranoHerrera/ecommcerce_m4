import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FilesRepository } from './files.repository';

@Module({
  imports: [CloudinaryModule],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
})
export class FilesModule {}
