import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Balance } from './balance.entity';
import { Expense } from './expense.entity';
import { Income } from './income.entity';
import { Installment } from './installment.entity';

@Entity({ schema: 'finance', name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number

  @Column({ name: 'income_id'})
  incomeId: number

  @Column({ name: 'expense_id'})
  expenseId: number

  @ManyToOne(() => Expense, (expense) => expense.payment)
  @JoinColumn({ name: 'expense_id' })
  expense?: Expense

  @ManyToOne(() => Income, (income) => income.payment)
  @JoinColumn({ name: 'income_id' })
  income?: Income

  @OneToMany(() => Balance, (payment) => payment.payment)
  balance?: Balance[]
}
