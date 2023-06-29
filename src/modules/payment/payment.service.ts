import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  create(userId: string, paymentDto: PaymentDto): Promise<Payment> {
    return this.paymentModel.create({ ...paymentDto, userId });
  }

  getListByUserId(userId: string): Promise<Payment[]> {
    return this.paymentModel.findAll({
      where: { userId },
      attributes: ['cardNumber', 'cardOwner', 'expiry', 'id'],
    });
  }

  get(id: string): Promise<Payment> {
    return this.paymentModel.findOne({
      where: { id },
      attributes: ['cardNumber', 'cardOwner', 'expiry', 'id'],
    });
  }

  delete(id: string): Promise<number> {
    return this.paymentModel.destroy({ where: { id } });
  }
}
