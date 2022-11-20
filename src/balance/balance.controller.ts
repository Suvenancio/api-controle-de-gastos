import {
  Controller,
  Get,
  HttpException,
  Param,
  HttpStatus
} from '@nestjs/common';
import { BalanceService } from './balance.service'


@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}
  @Get()
  async getBalance() {
    return await this.balanceService.getAll();
  }

  @Get('/income/:id')
  getBalanceByIncomeId(@Param() params) {
    const findeBalanceByIncomeId = this.balanceService.findByIncomeId(params.id)
    if (!findeBalanceByIncomeId) {
      throw new HttpException(
        `ID ${params.id} não encontrado `,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
