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
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @ApiOperation({ summary: 'Subir imagen de producto (postman)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiBody({
    description: 'Archivo de imagen a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente.' })
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