import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/security/auth.guard';
import { RolesGuard } from '../../common/security/roles.guard';
import { Roles } from '../../common/security/roles.decorator';
import { Role } from '../../common/security/role.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UuidPipe } from '../../common/pipes/uuid.pipe';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar, filtrar y paginar productos' })
  @ApiOkResponse({ type: PaginatedProductsResponseDto })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('seeder')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cargar productos de ejemplo' })
  @ApiResponse({
    status: 200,
    description: 'Productos de ejemplo cargados exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Productos no cargados.' })
  async seedProducts() {
    return await this.productsService.seedProducts();
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token JWT inválido o ausente.',
  })
  @ApiOperation({ summary: 'Crear productos, (solo admin)' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al crear producto' })
  @ApiForbiddenResponse({
    description: 'No tiene permisos para acceder a este recurso.',
  })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token JWT inválido o ausente.',
  })
  @ApiOperation({ summary: 'Obtener productos por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Prodcuto obtenido exitosamente' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @UseGuards(AuthGuard)
  findOne(@Param('id', UuidPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token JWT inválido o ausente.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar productos por su ID, (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiForbiddenResponse({
    description: 'No tiene permisos para acceder a este recurso.',
  })
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
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  update(@Param('id', UuidPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token JWT inválido o ausente.',
  })
  @ApiOperation({ summary: 'Eliminar productos por ID, (solo admin)' })
  @ApiResponse({ status: 200, description: 'Prodcuto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Prodcuto no encontrado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', UuidPipe) id: string) {
    return this.productsService.remove(id);
  }
}
