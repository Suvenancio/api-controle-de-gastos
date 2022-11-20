
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Installment } from './installment.entity';
import { Payment } from './payment.entity';
import { PaymentMethod } from './payment_method.entity';

@Entity({ schema: 'finance', name: 'expense' })
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'description'})
  description: string;

  @Column({ name: 'date'})
  date: Date;

  @Column({ name: 'value' })
  value: number

  @Column({ name: 'payment_method_id'})
  paymentMethodId: number

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.expense, { cascade: true })
  @JoinColumn({ name: 'payment_method_id'})
  paymentMethod?: PaymentMethod

  @OneToMany(() => Installment, (installment) => installment.expense)
  installments?: Installment[]

  @OneToMany(() => Payment, (payment) => payment.expense)
  payment?: Payment[]
}
