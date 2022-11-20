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
import { IncomeDto } from './dto/income.dto';
import { IncomeService } from './income.service'

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}
  @Get()
  getExpense() {
    return this.incomeService.getAll();
  }

  @Get(':id')
  getAnIncome(@Param() params) {
    const findedExpense = this.incomeService.findById(params.id);
    if (!findedExpense) {
      throw new HttpException(
        `ID ${params.id} não encontrado `,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  create(@Body() createExpenseDto: IncomeDto) {
    return this.incomeService.create(createExpenseDto)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIncomeDto: IncomeDto) {
  //   return this.incomeService.update(id, updateIncomeDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: number) {
  //   return this.incomeService.delete(id);
  // }
}
