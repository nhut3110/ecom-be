import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Cart } from '../carts/cart.entity';
import { Address } from '../addresses/address.entity';
import { Payment } from '../payment/payment.entity';
import { CartModule } from '../carts/carts.module';
import { CartService } from '../carts/carts.service';
import { OrderDetail } from './entities/order-detail.entity';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { AppConfigModule } from '../config/app-config.module';
import { Discount } from '../discounts/discount.entity';
import { Product } from '../products/product.entity';
import { DiscountService } from '../discounts/discounts.service';
import { ProductService } from '../products/products.service';
import { DiscountModule } from '../discounts/discounts.module';
import { ProductModule } from '../products/products.module';
import { UserDiscount } from '../discounts/user_discount.entity';
import { AppConfigService } from '../config/app-config.service';
import { User } from '../users/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      Cart,
      Address,
      Payment,
      OrderDetail,
      Discount,
      Product,
      UserDiscount,
      User,
    ]),
    CartModule,
    MailModule,
    DiscountModule,
    ProductModule,
    AppConfigModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    CartService,
    MailService,
    DiscountService,
    ProductService,
    AppConfigService,
  ],
})
export class OrderModule {}
