import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentService } from './payment.service';


@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [],
  providers: [PaymentService],
})
export class PaymentModule {}
