import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { createCartResponse } from './utils/createCartResponse';
import { CartOutput } from './interfaces/card-output.interface';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,
  ) {}

  async addProductToCart({
    userId,
    productId,
    quantity,
  }: CartDto): Promise<Cart> {
    const cartProduct = await this.cartModel.findOne({
      where: { userId, productId },
    });

    if (cartProduct)
      return await this.updateQuantity({ userId, productId, quantity });

    return await this.cartModel.create({ userId, productId, quantity });
  }

  async get(userId: string): Promise<CartOutput> {
    const cart = await this.cartModel.findAll({
      where: { userId },
      include: [Product],
    });

    return createCartResponse(cart);
  }

  async removeProductFromCart(
    userId: string,
    productId: string,
  ): Promise<number> {
    return await this.cartModel.destroy({ where: { userId, productId } });
  }

  async clear(userId: string): Promise<number> {
    return await this.cartModel.destroy({ where: { userId } });
  }

  async updateQuantity({
    userId,
    productId,
    quantity,
  }: CartDto): Promise<Cart> {
    const cartItem = await this.cartModel.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);

      if (cartItem.quantity <= 0) {
        await cartItem.destroy();
      } else {
        await cartItem.save();
      }
    }
    return cartItem;
  }
}
