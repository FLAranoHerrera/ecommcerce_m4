import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './orderDetail.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @OneToOne(() => OrderDetail, orderDetail => orderDetail.order, {
    cascade: true,
  })
  @JoinColumn()
  orderDetail: OrderDetail;
}
