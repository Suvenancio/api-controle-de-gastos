import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseDto } from './dto/expense.dto';
import { Expense } from './entities/expense.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  getAll() {
    return this.expenseRepository.find({
      relations: ['paymentMethod']
    });
  }

  async getOne(id: number) {
    const expense = await this.expenseRepository.findOne({
      where: { id: id },
      relations: ['paymentMethod']
    });
    
    if (!expense) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return expense;
  }

  async create(expenseDTO: ExpenseDto) {
    
  const paymentMethod = await this.preLoadPayment(expenseDTO.paymentMethod)
      
   const expense = this.expenseRepository.create({
     ...expenseDTO,
     paymentMethod
   });

    return this.expenseRepository.save(expense); 
  }

  async update(id: string, expenseDTO: ExpenseDto) {
    const paymentMethod = await this.preLoadPayment(expenseDTO.paymentMethod)
    
    const updateExpense = await this.expenseRepository.preload({
      id: +id,
      ...expenseDTO,
      paymentMethod
    });

    if (!updateExpense) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return this.expenseRepository.save(updateExpense);
  }

  async delete(id: number) {
    const expense = await this.expenseRepository.findOne({ where: { id: id } });

    if (!expense) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return this.expenseRepository.remove(expense);
  }

  private async preLoadPayment(name: string): Promise<PaymentMethod> {
    const payment = await this.paymentMethodRepository.findOne( {where : { name }})

    if (payment) {
      return payment;
    }
    const newPaymentMethod = this.paymentMethodRepository.create({ name });

    return this.paymentMethodRepository.save(newPaymentMethod)
  }
}
