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
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/roles.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UuidPipe } from '../pipes/uuid.pipe';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { privateDecrypt } from 'crypto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
  @ApiOperation({ summary: 'Obtener productos por su ID, solo admin'})
  @ApiParam({ name: 'id', description: 'ID del producto'})
  @ApiResponse({ status: 200, description: 'Prodcuto obtenido exitosamente'})
  @ApiResponse({ status: 404, description: 'Producto no encontrado'})
  @UseGuards(AuthGuard)
  findOne(@Param('id', UuidPipe) id: string) {
    return this.productsService.findOne(id);
  }

  
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar productos por su ID, solo admin'})
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente'})
  @ApiResponse({ status: 404, description: 'Producto no encontrado'})
  @ApiForbiddenResponse({ description: 'No tiene permisos para acceder a este recurso.' })
  @ApiBody({ 
    type: UpdateProductDto,
    description: 'Datos para actualizar el producto',
    examples: { 
      ejemplo: { 
        summary: 'Ejemplo de actualizacion de producto',
        value: { 
          name: 'Nuevo nombre del proudcto',
          price: 199.99,
          stock: 100,
          imgUrl: 'https://example.com/image.jpg',
          categoryId: '123e4567-e89b-12d3-a456-426614174000'
        }
       }
     }
  })
  update(
    @Param('id', UuidPipe) id: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.update(id, dto);
  }
  


  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
  @ApiOperation({ summary: 'Eliminar productos por ID, solo admin' })
  @ApiResponse({ status: 200, description: 'Prodcuto eliminado exitosamente'})
  @ApiResponse({ status: 404, description: 'Prodcuto no encontrado' })
  @UseGuards(AuthGuard)
  remove(@Param('id', UuidPipe) id: string) {
    return this.productsService.remove(id);
  }
}
