import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
  DefaultValuePipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UuidPipe } from '../pipes/uuid.pipe';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear productos, solo admin '})
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiForbiddenResponse({ description: 'No tiene permisos para acceder a este recurso.' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener paginado de productos' })
  @ApiResponse({ status: 200, description: 'Paginas obtenidas exitosamente'})
  @ApiResponse({ status: 404, description: 'Paginas no obtenidas'})
  @UseGuards(AuthGuard)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    if (page < 1) {
      throw new BadRequestException('La página debe ser mayor o igual a 1');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('El límite debe estar entre 1 y 100');
    }
    return this.productsService.findAll(page, limit);
  }

  @Get('seeder')
  @ApiOperation({ summary: 'Cargar productos de ejemplo' })
  @ApiResponse({ status: 200, description: 'Productos de ejemplo cargados exitosamente' })
  @ApiResponse({ status: 404, description: 'Productos no cargados.'})
  async seedProducts() {
    return await this.productsService.seedProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener productos por su ID, solo admin'})
  @ApiParam({ name: 'id', description: 'ID del producto'})
  @ApiResponse({ status: 200, description: 'Prodcuto obtenido exitosamente'})
  @ApiResponse({ status: 404, description: 'Producto no encontrado'})
  @UseGuards(AuthGuard)
  findOne(@Param('id', UuidPipe) id: string) {
    return this.productsService.findOne(id);
  }

  /*
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiForbiddenResponse({ description: 'No tiene permisos para acceder a este recurso.' })
  update(
    @Param('id', UuidPipe) id: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.update(id, dto);
  }
  */

  // @Post('uploadImage/:productId')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImage(
  //   @Param('productId', UuidPipe) productId: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.productsService.uploadImage(productId, file);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar productos por ID, solo admin' })
  @ApiResponse({ status: 200, description: 'Prodcuto eliminado exitosamente'})
  @ApiResponse({ status: 404, description: 'Prodcuto no encontrado' })
  @UseGuards(AuthGuard)
  remove(@Param('id', UuidPipe) id: string) {
    return this.productsService.remove(id);
  }
}
