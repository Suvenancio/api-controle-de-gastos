import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IncomeDto } from "./dto/income.dto";
import { Income } from "../entities/income.entity";

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,

  ) { }

  async getAll() {
    return await this.incomeRepository.find()
  }

  async findById(incomeId: number) {
    return await this.incomeRepository.findOne({ where: { id: incomeId}})
  }

  async create(incomeDTO: IncomeDto) {
    const income = this.incomeRepository.create(incomeDTO)
    
    return await this.incomeRepository.save(income)
  }

  async update(incomeDTO: IncomeDto) {
    const income = await this.incomeRepository.preload(incomeDTO)
    
    return await this.incomeRepository.save(income)
  }
  
}