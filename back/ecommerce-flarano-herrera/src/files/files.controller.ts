import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';
import { MaxFileSizePipe } from 'src/pipes/max-file-size.pipe';
import { FileTypePipe } from 'src/pipes/file-type.pipe';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new MaxFileSizePipe(200 * 1024), // 200 KB
      new FileTypePipe(['image/jpeg', 'image/png', 'image/webp']),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(id, file);
  }
}