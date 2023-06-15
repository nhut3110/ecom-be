import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { CartModule } from '../carts/carts.module';
import { CartService } from '../carts/carts.service';
import { Cart } from '../carts/cart.entity';
import { Product } from '../products/product.entity';
import { Address } from '../addresses/address.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, Cart, Product, Address]),
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CartService],
})
export class OrdersModule {}
