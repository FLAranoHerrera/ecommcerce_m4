import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Index('IDX_orders_user')
  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  user: User;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetail: OrderDetail;
}
