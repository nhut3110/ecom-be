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

@Module({
  imports: [
    SequelizeModule.forFeature([Order, Cart, Address, Payment, OrderDetail]),
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, CartService],
})
export class OrderModule {}
