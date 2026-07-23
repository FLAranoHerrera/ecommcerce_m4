import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UuidPipe } from '../../common/pipes/uuid.pipe';
import { AuthGuard } from '../../common/security/auth.guard';
import { RolesGuard } from '../../common/security/roles.guard';
import { Roles } from '../../common/security/roles.decorator';
import { Role } from '../../common/security/role.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'No se encontraron categorías.' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear una categoría (solo admin)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiConflictResponse({ description: 'El nombre de categoría ya existe.' })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido o ausente.' })
  @ApiForbiddenResponse({ description: 'Se requiere rol administrador.' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get('seeder')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cargar datos de ejemplo de categorías' })
  @ApiResponse({
    status: 200,
    description: 'Categorías de ejemplo cargadas exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se pudieron cargar las categorías de ejemplo.',
  })
  async seedCategories() {
    return await this.categoriesService.seedCategories();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría obtenida exitosamente.' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Categoria con id {id} no encontrada',
  })
  async getCategoryById(@Param('id', UuidPipe) id: string) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar una categoría (solo admin)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiConflictResponse({ description: 'El nombre de categoría ya existe.' })
  update(@Param('id', UuidPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Eliminar una categoría sin productos (solo admin)',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada.' })
  @ApiConflictResponse({
    description: 'La categoría todavía tiene productos asociados.',
  })
  remove(@Param('id', UuidPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
