import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity({ schema: 'finance', name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number

  @OneToOne(() => Expense)
  @JoinColumn({ name: 'expense_id' })
  expense?: Expense;

  @ManyToOne(() => PaymentMethod, (paymentmethod) => paymentmethod.payment)
  @JoinColumn({ name: 'payment_id' })
  paymentMethod?: PaymentMethod;
}
