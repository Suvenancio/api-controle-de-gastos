import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PaymentMethodDto } from './dto/payment_method.dto';
import { PaymentMethodService } from './payment_method.service';

@Controller('paymentMethod')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}
  @Get()
  getAll() {
    return this.paymentMethodService.getAll();
  }

  @Get(':id')
  getOne(@Param() params) {
    const findedExpense = this.paymentMethodService.findById(params.id);
    if (!findedExpense) {
      throw new HttpException(
        `ID ${params.id} não encontrado `,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  create(@Body() createPaymentMethodDto: PaymentMethodDto) {
    return this.paymentMethodService.create(createPaymentMethodDto)
  }

}
