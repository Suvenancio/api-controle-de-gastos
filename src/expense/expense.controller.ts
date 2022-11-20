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
import { ExpenseDto } from './dto/expense.dto';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly ExpenseService: ExpenseService) {}
  @Get()
  getExpense() {
    return this.ExpenseService.getAll();
  }

  @Get(':id')
  getAnExpense(@Param() params) {
    const findedExpense = this.ExpenseService.findById(params.id);
    if (!findedExpense) {
      throw new HttpException(
        `ID ${params.id} não encontrado `,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  create(@Body() createExpenseDto: ExpenseDto) {
    return this.ExpenseService.create(createExpenseDto)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateExpenseDto: ExpenseDto) {
    return this.ExpenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.ExpenseService.delete(id);
  }
}
