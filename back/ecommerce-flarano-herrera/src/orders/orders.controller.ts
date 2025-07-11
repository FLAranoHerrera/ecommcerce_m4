import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UuidPipe } from '../pipes/uuid.pipe';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'No autorizado. Token JWT inválido o ausente.' })
@UseGuards(AuthGuard)
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear orden de compra'})
  @ApiResponse({ status: 201, description: 'Orden de compra creada exitosamente.'})
  @ApiResponse({ status: 404, description: 'Error al crear orden de compra'})
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto) {
    if (!dto.products || dto.products.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un producto');
    }
    return this.ordersService.addOrder(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Ordenes de compra por ID'})
  @ApiResponse({ status: 200, description: 'Ordenes obtenidas exitosamente'})
  @ApiResponse({ status: 404, description: 'Error al obtener las ordenes'})
  findOne(@Param('id', UuidPipe) id: string) {
    return this.ordersService.getOrder(id);
  }
} 