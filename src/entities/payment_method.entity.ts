import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { Income } from './income.entity';
import { PaymentMethodType } from './payment_method_type.entity';


@Entity({ schema: 'finance', name: 'payment_method' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name'})
  name?: string;

  @Column({ name: 'due_date'})
  dueDate?: number; 

  @Column({ name: 'type_id'})
  typeId?: number;

  @Column({  nullable: true , name: 'income_id'})
  incomeId?: number;

  @OneToMany(() => Expense, (expense) => expense.paymentMethod)
  expense?: Expense[];

  @ManyToOne(() => Income, (income) => income.paymentMethod)
  @JoinColumn({ name: 'income_id' })
  income?: Income

  @ManyToOne(() => PaymentMethodType, (paymentMethodType) => paymentMethodType.paymentMethod)
  @JoinColumn({ name: 'type_id' })
  type?: PaymentMethodType
}
