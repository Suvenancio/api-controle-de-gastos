import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installment } from '../entities/installment.entity';
import { InstallmentService } from './installment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Installment])],
  controllers: [],
  providers: [InstallmentService ],
})
export class InstallmentModule {}
