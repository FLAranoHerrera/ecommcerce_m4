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
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../../common/security/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UuidPipe } from '../../common/pipes/uuid.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { OrderQueryDto } from './dto/order-query.dto';
import {
  OrderListResponseDto,
  OrderResponseDto,
} from './dto/order-response.dto';

@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({
  description: 'No autorizado. Token JWT inválido o ausente.',
})
@UseGuards(AuthGuard)
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar historial de órdenes',
    description:
      'Los usuarios ven únicamente sus compras; los administradores ven todas las órdenes.',
  })
  @ApiOkResponse({ type: OrderListResponseDto })
  findAll(@Query() query: OrderQueryDto, @Req() req: Request) {
    const user = req['user'] as { sub: string; admin: boolean };
    return this.ordersService.findAll(user.sub, user.admin, query);
  }

  @Post()
  @ApiOperation({ summary: 'Crear orden de compra' })
  @ApiBody({
    type: CreateOrderDto,
    description:
      'Productos que integran la orden. El usuario se obtiene del JWT.',
  })
  @ApiResponse({
    status: 201,
    description: 'Orden de compra creada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Producto con id {id} no encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto {name} sin stock disponible',
  })
  @ApiResponse({
    status: 400,
    description: 'El precio del producto {name} no es un número válido',
  })
  @ApiResponse({
    status: 400,
    description: 'El total calculado no es un número válido',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    if (!dto.products || dto.products.length === 0) {
      throw new BadRequestException(
        'La orden debe contener al menos un producto',
      );
    }
    const user = req['user'] as { sub: string };
    return this.ordersService.addOrder(user.sub, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Ordenes de compra por ID' })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'UUID de la orden',
  })
  @ApiResponse({ status: 200, description: 'Ordenes obtenidas exitosamente' })
  @ApiOkResponse({ type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findOne(@Param('id', UuidPipe) id: string, @Req() req: Request) {
    const user = req['user'] as { sub: string; admin: boolean };
    return this.ordersService.getOrder(id, user.sub, user.admin);
  }
}
