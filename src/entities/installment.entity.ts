

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expense } from "./expense.entity";

@Entity({ schema: 'finance', name: 'installment' })
export class Installment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quantity'})
  quantity: number

  @Column({ name: 'installment_number'})
  installmentNumber: number

  @Column({ name: 'value'})
  value: number

  @Column({name: 'is_payed'})
  isPayed: boolean

  @Column({name: 'expense_id'})
  expenseId: number

  @ManyToOne(() => Expense, (expense) => expense.installments, { cascade: true })
  @JoinColumn({ name: 'expense_id' })
  expense: Expense
}