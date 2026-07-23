import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../../database/entities/order.entity';
import { OrderDetail } from '../../database/entities/order-detail.entity';
import { Product } from '../../database/entities/product.entity';
import { User } from '../../database/entities/user.entity';
import { SecurityModule } from '../../common/security/security.module';
import { OrderItem } from '../../database/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, OrderItem, Product, User]),
    SecurityModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
