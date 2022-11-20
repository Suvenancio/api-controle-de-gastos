
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Income } from './income.entity';
import { Payment } from './payment.entity';

@Entity({ schema: 'finance', name: 'balance' })
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'payment_id' })
  paymentId: number;

  @ManyToOne(() => Payment, (payment) => payment.balance)
  @JoinColumn({ name: 'payment_id' })
  payment?: Payment
  
  @ManyToMany(() => Income, (income) => income.balance, {
    cascade: true
  })
  @JoinTable({ name: 'income_id' })
  income?: Income[]
}
