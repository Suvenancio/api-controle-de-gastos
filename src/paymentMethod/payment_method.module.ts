import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodType } from '../entities/payment_method_type.entity';
import { PaymentMethod } from '../entities/payment_method.entity';
import { PaymentMethodService } from './payment_method.service';
import { PaymentMethodController } from './payment_method.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, PaymentMethodType])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService ],
})
export class PaymentMethodModule {}
