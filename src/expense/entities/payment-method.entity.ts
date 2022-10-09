import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';

@Entity({ schema: 'finance', name: 'payment' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Expense, (expense) => expense.paymentMethod, { cascade: true })
  expense?: Expense[];
}
