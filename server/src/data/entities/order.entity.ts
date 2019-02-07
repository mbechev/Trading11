import { Company } from './company.entity';
import { Status } from './status.entity';
import { User } from './user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => User, user => user.orders)
  client: Promise<User>;

  @Column()
  opendate: Date;

  @Column({ nullable: true, default: null })
  closedate: Date;

  @ManyToOne(type => Company, company => company.orders, { eager: true })
  company: Company;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  openPrice: number;

  @Column({ nullable: true, default: null, type: 'decimal', precision: 10, scale: 4 })
  closePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  units: number;

  @ManyToOne(type => Status, status => status.orders, { eager: true })
  status: Status;

  @Column({ nullable: true, default: null, type: 'decimal', precision: 10, scale: 4 })
  result: number;
  @Column()
  direction: string;
}
