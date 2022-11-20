import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "../entities/payment.entity";
import { PaymentDto } from "./dto/payment.dto";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

  ) { }

  async getAll() {
    return await this.paymentRepository.find()
  }

  async findById(id: number) {
    return await this.paymentRepository.findOne({ where: { id }})
  }

  async findIncomeById(incomeId: number) {
    return await this.paymentRepository.findOne({ where: { incomeId }})
  }

  async findExpenseById(expenseId: number) {
    return await this.paymentRepository.findOne({ where: { expenseId}})
  }

  async create(paymentDto: PaymentDto) {
    const payment = this.paymentRepository.create(paymentDto)
    
    return await this.paymentRepository.save(payment)
  }

  async update(id: number, paymentDto: PaymentDto) {
    const payment = await this.paymentRepository.preload({
      id: +id,
      ... paymentDto
    })
    
    return await this.paymentRepository.save(payment)
  }

  async delete(id: number) {
    const payment = await this.findById(id);
    
    if (!payment) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return this.paymentRepository.remove(payment);
  }
  
}