import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InstallmentDto } from "./dto/installment.dto";
import { Installment } from "../entities/installment.entity";

@Injectable()
export class InstallmentService {
  constructor(
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,

  ) { }

  async getAll() {
    return await this.installmentRepository.find()
  }

  async findById(id: number) {
    return await this.installmentRepository.findOne({ where: { id: id}})
  }

  async findByExpenseId(expenseId: number): Promise<Installment[]> {
    return await this.installmentRepository.find({ where: { expenseId }})
  }

  async deleteByExpenseId(expenseId: number) {
    const installment = await this.findByExpenseId(expenseId);
    
    if (installment.length === 0) {
      throw new NotFoundException(`Registro ${expenseId} não encontrado`);
    }

    return await this.installmentRepository.remove(installment);
  }

  async create(installmentDTO: InstallmentDto) {

    const installment = this.installmentRepository.create(installmentDTO)
    
    return await this.installmentRepository.save(installment)
  }

  async update(installmentDTO: InstallmentDto) {
    const installment = await this.installmentRepository.preload(installmentDTO)
    
    return await this.installmentRepository.save(installment)
  } 
}