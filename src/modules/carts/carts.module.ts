import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartController } from './carts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Cart, Product])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
