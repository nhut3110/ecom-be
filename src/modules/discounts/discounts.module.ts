import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Discount } from './discount.entity';
import { UserDiscount } from './user_discount.entity';
import { DiscountController } from './discounts.controller';
import { DiscountService } from './discounts.service';

@Module({
  imports: [SequelizeModule.forFeature([Discount, UserDiscount])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
