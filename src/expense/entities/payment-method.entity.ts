import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { Payment } from './payment.entity';

@Entity({ schema: 'finance', name: 'payment_method' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  dueDate?: Date; 

  @OneToMany(() => Expense, (expense) => expense.paymentMethod, { cascade: true })
  expense?: Expense[];

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payment?: Payment[]
}
