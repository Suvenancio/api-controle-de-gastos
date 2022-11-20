import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceModule } from './balance/balance.module';
import { Expense } from './entities/expense.entity';
import { PaymentMethod } from './entities/payment_method.entity';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { InstallmentModule } from './installment/installment.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentMethodModule } from './paymentMethod/payment_method.module';

@Module({
  imports: [
    ExpenseModule,
    PaymentModule,
    PaymentMethodModule,
    BalanceModule,
    IncomeModule,
    InstallmentModule,
    TypeOrmModule.forRoot(
      {
      entities: [Expense, PaymentMethod],
      type: 'postgres',
      host: 'localhost',
      port: 5436,
      username: 'appfinance',
      password: '123456',
      database: 'apppersonalfinance',
      autoLoadEntities: true,
      synchronize: true,
      }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
