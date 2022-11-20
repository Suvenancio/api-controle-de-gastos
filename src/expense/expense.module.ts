import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';
import { PaymentMethod } from '../entities/payment_method.entity';
import { Installment } from '../entities/installment.entity';
import { InstallmentService } from '../installment/installment.service';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../entities/payment.entity';
import { BalanceService } from '../balance/balance.service';
import { Balance } from '../entities/balance.entity';
import { PaymentMethodType } from '../entities/payment_method_type.entity';
import { PaymentMethodService } from '../paymentMethod/payment_method.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, PaymentMethod,Installment, Payment, Balance, PaymentMethodType])],
  controllers: [ExpenseController],
  providers: [ExpenseService, InstallmentService, PaymentService, BalanceService, PaymentMethodService],
})
export class ExpenseModule {}
