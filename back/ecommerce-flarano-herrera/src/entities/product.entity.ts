import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderDetail } from './orderDetail.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ default: 'https://via.placeholder.com/150' })
  imgUrl: string;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @ManyToMany(() => OrderDetail, orderDetail => orderDetail.products)
  @JoinTable()
  orderDetails: OrderDetail[];
}
