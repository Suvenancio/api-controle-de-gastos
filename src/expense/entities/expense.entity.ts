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
  total: number;

  @Column()
  installmentsQty: number;

  @Column()
  totalToPay: number;

  @Column()
  dueDate: Date;

  @ManyToOne(() => PaymentMethod, (paymentOption) => paymentOption.expense,)
  @JoinColumn({ name: 'payment_method' })
  paymentMethod?: PaymentMethod;
}
