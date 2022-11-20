import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentMethodDto } from "./dto/payment_method.dto";
import { PaymentMethod } from "../entities/payment_method.entity";

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,

  ) { }

  async getAll() {
    return await this.paymentMethodRepository.find({
      relations: ['income']
    })
  }

  async findById(id: number) {
    return await this.paymentMethodRepository.findOne({
      where: { id },
      relations: ['type', 'income']
    })
  }

  async create(paymentMethodDto: PaymentMethodDto) {

    const paymentMethod = this.paymentMethodRepository.create(paymentMethodDto)
    
    return await this.paymentMethodRepository.save(paymentMethod)
  }

  async update(paymentMethodDto: PaymentMethodDto) {
    const paymentMethod = await this.paymentMethodRepository.preload(paymentMethodDto)
    
    return await this.paymentMethodRepository.save(paymentMethod)
  } 

}