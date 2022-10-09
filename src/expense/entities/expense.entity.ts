import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Entity({ schema: 'finance', name: 'expense' })
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  value: number;

  @Column()
  installmentsQty: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.expense)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod?: PaymentMethod;

}
