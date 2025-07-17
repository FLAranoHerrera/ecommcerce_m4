import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UuidPipe } from '../pipes/uuid.pipe';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'Lista de usuarios no obtenida'})
  @ApiForbiddenResponse({ description: 'No tiene permisos para acceder a este recurso.' })
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
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id', UuidPipe) id: string) {
    return this.usersService.findOne(id);
  }
  
  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos para actualizar el usuario. Todos los campos son opcionales.',
    examples: {
      ejemplo: {
        summary: 'Ejemplo de actualización',
        value: {
          name: 'Nuevo nombre',
          phone: 1234567890,
          country: 'México',
          address: 'Calle Falsa 123',
          city: 'Ciudad de México',
          admin: false
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(
    @Param('id', UuidPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario por ID (solo admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiForbiddenResponse({ description: 'No tiene permisos para acceder a este recurso.' })
  remove(@Param('id', UuidPipe) id: string) {
    return this.usersService.remove(id);
  }
}
