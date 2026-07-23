import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderDetail } from '../../database/entities/order-detail.entity';
import { Product } from '../../database/entities/product.entity';
import { User } from '../../database/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from '../../database/entities/order-item.entity';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(userId: string, isAdmin: boolean, query: OrderQueryDto) {
    const { page, limit } = query;
    const ordersQuery = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderDetail', 'detail')
      .leftJoinAndSelect('detail.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .orderBy('order.date', 'DESC')
      .addOrderBy('item.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (!isAdmin) {
      ordersQuery.andWhere('user.id = :userId', { userId });
    }

    const [data, total] = await ordersQuery.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async addOrder(userId: string, dto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(User, { id: userId });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const requested = new Map(
        dto.products.map((item) => [item.id, item.quantity ?? 1]),
      );
      if (requested.size !== dto.products.length) {
        throw new BadRequestException(
          'Cada producto debe aparecer una sola vez; use quantity',
        );
      }
      const productIds = [...requested.keys()];
      const productsFromDb = await queryRunner.manager
        .createQueryBuilder(Product, 'product')
        .setLock('pessimistic_write')
        .where('product.id IN (:...productIds)', { productIds })
        .getMany();

      if (productsFromDb.length !== productIds.length) {
        throw new NotFoundException(
          'Uno o más productos no fueron encontrados',
        );
      }

      let total = 0;
      for (const product of productsFromDb) {
        const quantity = requested.get(product.id)!;
        if (product.stock < quantity) {
          throw new BadRequestException(
            `Producto ${product.name} sin stock disponible`,
          );
        }
        product.stock -= quantity;
        total += Number(product.price) * quantity;
      }

      const order = this.ordersRepository.create({ user, date: new Date() });
      await queryRunner.manager.save(order);

      const orderDetail = this.orderDetailsRepository.create({
        order,
        price: total,
      });
      await queryRunner.manager.save(orderDetail);

      const items = productsFromDb.map((product) => {
        const quantity = requested.get(product.id)!;
        const unitPrice = Number(product.price);
        return queryRunner.manager.create(OrderItem, {
          orderDetail,
          product,
          quantity,
          unitPrice,
          subtotal: unitPrice * quantity,
        });
      });
      await queryRunner.manager.save(items);

      await queryRunner.manager.save(productsFromDb);

      await queryRunner.commitTransaction();

      return {
        id: order.id,
        message: 'Orden creada exitosamente',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async getOrder(id: string, userId: string, isAdmin: boolean) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'orderDetail',
        'orderDetail.items',
        'orderDetail.items.product',
        'user',
      ],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (!isAdmin && order.user.id !== userId) {
      throw new ForbiddenException('No puede consultar una orden ajena');
    }

    return order;
  }
}
