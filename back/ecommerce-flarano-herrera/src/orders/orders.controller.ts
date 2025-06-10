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

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto) {
    if (!dto.products || dto.products.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un producto');
    }
    return this.ordersService.addOrder(dto);
  }

  @Get(':id')
  findOne(@Param('id', UuidPipe) id: string) {
    return this.ordersService.getOrder(id);
  }
} 