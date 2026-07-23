import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { MaxFileSizePipe } from '../../common/pipes/max-file-size.pipe';
import { FileTypePipe } from '../../common/pipes/file-type.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiBadGatewayResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../common/security/roles.guard';
import { AuthGuard } from '../../common/security/auth.guard';
import { Roles } from '../../common/security/roles.decorator';
import { Role } from '../../common/security/role.enum';
import { UuidPipe } from '../../common/pipes/uuid.pipe';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Subir imagen de producto' })
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
  @ApiBadRequestResponse({
    description: 'Archivo ausente, demasiado grande o con formato inválido.',
  })
  @ApiNotFoundResponse({ description: 'Producto no encontrado.' })
  @ApiServiceUnavailableResponse({
    description: 'Cloudinary no está configurado.',
  })
  @ApiBadGatewayResponse({
    description: 'Cloudinary no pudo procesar la imagen.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }),
  )
  uploadImage(
    @Param('id', UuidPipe) id: string,
    @UploadedFile(
      new MaxFileSizePipe(5 * 1024 * 1024),
      new FileTypePipe(['image/jpeg', 'image/png', 'image/webp']),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductImage(id, file);
  }
}
