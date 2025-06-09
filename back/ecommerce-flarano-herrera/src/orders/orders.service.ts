import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/orderDetail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addOrder(dto: CreateOrderDto) {
    // Buscar usuario
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Crear orden
    const order = this.ordersRepository.create({
      user,
      date: new Date(),
    });
    const savedOrder = await this.ordersRepository.save(order);

    // Buscar productos y calcular total
    let total = 0;
    const products = await Promise.all(
      dto.products.map(async (productDto) => {
        const product = await this.productsRepository.findOneBy({ id: productDto.id });
        if (!product) {
          throw new NotFoundException(`Producto con id ${productDto.id} no encontrado`);
        }
        if (product.stock <= 0) {
          throw new NotFoundException(`Producto ${product.name} sin stock disponible`);
        }
        total += product.price;
        return product;
      }),
    );

    // Crear detalle de orden
    const orderDetail = this.orderDetailsRepository.create({
      order: savedOrder,
      price: total,
      products,
    });
    const savedOrderDetail = await this.orderDetailsRepository.save(orderDetail);

    // Actualizar stock de productos
    await Promise.all(
      products.map(async (product) => {
        product.stock -= 1;
        await this.productsRepository.save(product);
      }),
    );

    return {
      id: savedOrder.id,
      total: savedOrderDetail.price,
      orderDetailId: savedOrderDetail.id,
    };
  }

  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderDetail', 'orderDetail.products', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }
} 