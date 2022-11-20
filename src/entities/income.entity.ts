
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  JoinTable
} from 'typeorm';
import { Balance } from './balance.entity';
import { Payment } from './payment.entity';
import { PaymentMethod } from './payment_method.entity';


@Entity({ schema: 'finance', name: 'income' })
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'value'})
  value: number;

  @Column({ name: 'date' })
  date: number;

  @OneToMany(() => Payment, (payment) => payment.income)
  payment?: Payment[]

  @ManyToMany(() => Balance, (balance) => balance.income)
  @JoinTable()
  balance: Balance[]

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.income)
  paymentMethod?: PaymentMethod[];
}
