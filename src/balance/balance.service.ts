import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BalanceDto } from "./dto/balance.dto";
import { Balance } from "../entities/balance.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,

  ) { }

  async getAll() {
    return await this.balanceRepository.find()
  }

  async findById(id: number) {
    return await this.balanceRepository.findOne({ where: { id }})
  }

  async findByPaymentId(paymentId: number) {
    return await this.balanceRepository.findOne({ where: { paymentId}})
  }

  async findByIncomeId(incomeId: number) {
    const balanceByIncome = await this.balanceRepository.findOne({
      relations: {
        payment: true
      },
      where: {
        payment: {
          incomeId
        }
      },
      order: {
        date: 'DESC'
      }
    })

    return balanceByIncome
  }

  async create(balanceDto: BalanceDto) {
    const balance = this.balanceRepository.create(balanceDto)
    
    return await this.balanceRepository.save(balance)
  }

  async updateBalanceById(id: number, balanceDto: BalanceDto) {
    const balance = await this.balanceRepository.preload({
      id: +id,
      ...balanceDto
    })
    
    return await this.balanceRepository.save(balance)
  }

  async delete(id: number) {
    const balance = await this.findById(id);
    
    if (!balance) {
      throw new NotFoundException(`Registro ${id} não encontrado`);
    }

    return this.balanceRepository.remove(balance);
  }
  
}