import { IsString, IsNumber, isString } from 'class-validator';
import { PaymentMethod } from '../entities/payment-method.entity';

export type ExpenseDto = {
  description: string;
  date: Date;
  total: number;
  installmentsQty: number;
  totalToPay: number;
  dueDate: Date;
  paymentMethod: string
}
