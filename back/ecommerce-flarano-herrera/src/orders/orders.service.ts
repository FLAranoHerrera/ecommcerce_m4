import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/orderDetail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  dataSource: any;
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
    // 2. Inicia el QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(User, { id: dto.userId });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      
      const productIds = dto.products.map(p => p.id);
      const productsFromDb = await queryRunner.manager.findBy(Product, {
        id: In(productIds),
      });

      if (productsFromDb.length !== productIds.length) {
          throw new NotFoundException('Uno o más productos no fueron encontrados');
      }

      let total = 0;
      for (const product of productsFromDb) {
        if (product.stock <= 0) {
            throw new BadRequestException(`Producto ${product.name} sin stock disponible`);
        }
        product.stock -= 1; // Preparamos la reducción de stock
        total += Number(product.price);
      }

      // Creamos la orden
      const order = this.ordersRepository.create({ user, date: new Date() });
      await queryRunner.manager.save(order);
      
      // Creamos el detalle de la orden
      const orderDetail = this.orderDetailsRepository.create({
        order,
        price: total,
        products: productsFromDb, // Usamos los productos ya actualizados en memoria
      });
      await queryRunner.manager.save(orderDetail);

      // Guardamos el stock actualizado de los productos
      await queryRunner.manager.save(productsFromDb);
      
      // 3. Si todo va bien, confirma la transacción
      await queryRunner.commitTransaction();

      return {
        id: order.id,
        message: "Orden creada exitosamente"
      };

    } catch (error) {
      // 4. Si algo falla, revierte todos los cambios
      await queryRunner.rollbackTransaction();
      // Re-lanza el error para que NestJS lo maneje
      throw error;
    } finally {
      // 5. Libera el queryRunner
      await queryRunner.release();
    }
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