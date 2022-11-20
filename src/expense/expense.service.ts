import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseDto } from './dto/expense.dto';
import { Expense } from '../entities/expense.entity';
import { PaymentMethod } from '../entities/payment_method.entity';
import { InstallmentService } from '../installment/installment.service';
import { PaymentService } from '../payment/payment.service';
import { PaymentMethodService } from '../paymentMethod/payment_method.service';
import { BalanceService } from '../balance/balance.service';


@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly installmentService: InstallmentService,
    private readonly paymentService: PaymentService,
    private readonly balanceService: BalanceService,
    private readonly paymentMethodService: PaymentMethodService
  ) {}

  async getAll(): Promise<Expense[]> {
    return await this.expenseRepository.find();
  }

  async findById(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['paymentMethod']
    });
    
    if (!expense) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return expense;
  }

  async create(expenseDTO: ExpenseDto): Promise<ExpenseDto> { 
    let saveExpense;

    try {
      const expense = this.expenseRepository.create(expenseDTO);  
      saveExpense = await this.expenseRepository.save(expense);   
    
      if (expenseDTO.installmentsQty) {
        for (let index = 0; index < expenseDTO.installmentsQty; index++) {
          await this.installmentService.create({
            quantity: expenseDTO.installmentsQty,
            installmentNumber: index + 1,
            value: expense.value / expenseDTO.installmentsQty,
            isPayed: false,
            expenseId: saveExpense?.id
          })
        }
      } 
  
      const paymentMethod = await this.paymentMethodService.findById(expenseDTO.paymentMethodId)
      const balanceByIncome = await this.balanceService.findByIncomeId(paymentMethod.incomeId)
   
      if (paymentMethod.typeId === 2) {
        const newPayment = await this.paymentService.create({
          value: expenseDTO.value,
          incomeId: paymentMethod.incomeId,
          expenseId: saveExpense.id
        })
        
          if (!balanceByIncome) {
            await this.balanceService.create({
              paymentId: newPayment.id,
              date: new Date(),
              value: (paymentMethod.income.value - expenseDTO.value)
            })
          }
    
          await this.balanceService.create({
            paymentId: newPayment.id,
            date: new Date(),
            value: (balanceByIncome.value- expenseDTO.value)
          })
      }
    } catch (e) {
      throw 'Erro ao inserir despesa!'
    }

    return saveExpense
  }

  async update(id: number, expenseDTO: ExpenseDto): Promise<ExpenseDto> {    
    let updateExpense: ExpenseDto;

    const paymentMethod = await this.paymentMethodService.findById(expenseDTO.paymentMethodId)
    const installments = await this.installmentService.findByExpenseId(id)
    const expense = await this.findById(id)
    const balanceByIncome = await this.balanceService.findByIncomeId(expense.paymentMethod.incomeId)
   

    if (paymentMethod.typeId === 2 && installments.length > 0) {
      await this.installmentService.deleteByExpenseId(id)

      const newPayment = await this.paymentService.create({
        value: expenseDTO.value,
        incomeId: paymentMethod.incomeId,
        expenseId: id
      })
      
      if (!balanceByIncome) {
        await this.balanceService.create({
          paymentId: newPayment.id,
          date: new Date(),
          value: (expense.paymentMethod.income.value - expenseDTO.value)
        })
      }
  
      await this.balanceService.create({
        paymentId: newPayment.id,
        date: new Date(),
        value: (balanceByIncome.value - expenseDTO.value)
      })

      updateExpense = await this.expenseRepository.preload({
        id: +id,
        ...expenseDTO
      });
    } else if (paymentMethod.typeId === 1 && installments.length > 0) {
      //se mudou a quantidade de parcelas ou de cartão de crédito
      if (!expenseDTO.installmentsQty) {
        throw 'Você precisa informar a quantidade de parcelas!'
      }

      if (installments.length === expenseDTO.installmentsQty && expense.paymentMethodId === expenseDTO.paymentMethodId && expense.value === expenseDTO.value) {
        throw 'Você não possui informações para alterar'
        } else if (installments.length === expenseDTO.installmentsQty && expense.paymentMethodId !== expenseDTO.paymentMethodId && expense.value === expenseDTO.value) {
          updateExpense = await this.expenseRepository.preload({
            id: +id,
            ...expenseDTO
          })
      }
      
        await this.installmentService.deleteByExpenseId(id)

        //cria as parcelas
        for (let index = 0; index < expenseDTO.installmentsQty; index++) {
          await this.installmentService.create({
            quantity: expenseDTO.installmentsQty,
            installmentNumber: index + 1,
            value: expenseDTO.value / expenseDTO.installmentsQty,
            isPayed: false,
            expenseId: id
          })
        }
        
        updateExpense = await this.expenseRepository.preload({
          id: +id,
          ...expenseDTO
        })
      
    } else if (paymentMethod.typeId === 2 && installments.length === 0) {
      const payment = await this.paymentService.findExpenseById(id)

      if (expenseDTO.value === expense.value && expenseDTO.paymentMethodId === expense.paymentMethodId) {
        throw ' Informções de pagamento e valor já está atualizadas'
      }
      
      if (!payment) {
        throw 'Não existe pagamento para essa despesa!'
      }

      await this.paymentService.update(
        payment.id,
        {
          value: expenseDTO.value
        }
      )

      const balance = await this.balanceService.findByPaymentId(payment.id)
      const newValue = (payment.value - expenseDTO.value)

      if (!balance) {
        throw `Não existe nenhum registro no extrato para a despesa [expenseId: ${payment.id}]`
      }

      await this.balanceService.updateBalanceById(
        balance.id, {
        value: balance.value + newValue,
      })

    
      updateExpense = await this.expenseRepository.preload({
        id: +id,
        ...expenseDTO
      });
    
    } else if (paymentMethod.typeId === 1 && installments.length === 0) {
      if (!expenseDTO.installmentsQty) {
        throw 'Você precisa informar a quantidade de parcelas!'
      }

      const payment = await this.paymentService.findExpenseById(id)
      const balance = await this.balanceService.findByPaymentId(payment.id)
      
      await this.balanceService.delete(balance.id)
      await this.paymentService.delete(payment.id)

      for (let index = 0; index < expenseDTO.installmentsQty; index++) {
        await this.installmentService.create({
          quantity: expenseDTO.installmentsQty,
          installmentNumber: index + 1,
          value: expenseDTO.value / expenseDTO.installmentsQty,
          isPayed: false,
          expenseId: id
        })
      }

      updateExpense = await this.expenseRepository.preload({
        id: +id,
        ...expenseDTO
      });
    }

    if (!updateExpense) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return this.expenseRepository.save(updateExpense);
  }

  async delete(id: number): Promise<ExpenseDto> {
    const installments = await this.installmentService.findByExpenseId(id)
    const payment = await this.paymentService.findExpenseById(id)
    const balance = await this.balanceService.findByPaymentId(payment?.id)
    const expense = await this.findById(id)

    if (installments.length > 0) {   
      await this.installmentService.deleteByExpenseId(id)
    } else if (payment && balance) {
      await this.balanceService.delete(balance.id)
      await this.paymentService.delete(payment.id)     
    }
    
    return await this.expenseRepository.remove(expense)
  }

  private calculateDueDate(date:any) {
    const dateNow = new Date()
    // ver a diferença entre a data de hoje do vencimento do cartão
  }
}
