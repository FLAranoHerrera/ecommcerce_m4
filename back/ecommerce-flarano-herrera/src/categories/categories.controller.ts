import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UuidPipe } from 'src/pipes/uuid.pipe';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se encontraron categorías.' })
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Get('seeder')
  @ApiOperation({ summary: 'Cargar datos de ejemplo de categorías' })
  @ApiResponse({ status: 200, description: 'Categorías de ejemplo cargadas exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se pudieron cargar las categorías de ejemplo.' })
  async seedCategories() {
    return await this.categoriesService.seedCategories();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por su ID'})
  @ApiParam({ name: 'id', description: 'ID de la categoría'})
  @ApiResponse({ status: 200, description: 'Categoría obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'Categoria con id {id} no encontrada' })
  async getCategoryById(@Param('id', UuidPipe) id: string) { 
    return await this.categoriesService.getCategoryById(id);
  }
}