import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.addOrder(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
} 