import { Column, Entity, 
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { PaymentMethod } from './payment_method.entity';

@Entity({ schema: 'finance', name: 'payment_method_type' })
export class PaymentMethodType {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'description' })
  description?: string

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.type)
  paymentMethod?: PaymentMethod[]
}