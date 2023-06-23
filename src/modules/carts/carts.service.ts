import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
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
  }: CartDto): Promise<void | Cart> {
    const cartProduct = await this.cartModel.findOne({
      where: { userId, productId },
    });

    if (cartProduct)
      return await this.updateQuantity({ userId, productId, quantity });

    return await this.cartModel.create({ userId, productId, quantity });
  }

  get(userId: string): Promise<Cart[]> {
    return this.cartModel.findAll({
      where: { userId },
      include: [
        { model: Product, attributes: ['id', 'title', 'image', 'price'] },
      ],
      attributes: ['quantity'],
    });
  }

  removeProductFromCart(userId: string, productId: string): Promise<number> {
    return this.cartModel.destroy({ where: { userId, productId } });
  }

  clear(userId: string): Promise<number> {
    return this.cartModel.destroy({ where: { userId } });
  }

  async updateQuantity({
    userId,
    productId,
    quantity,
  }: CartDto): Promise<void | Cart> {
    const cartItem = await this.cartModel.findOne({
      where: { userId, productId },
    });

    if (!cartItem) throw new BadRequestException('Invalid cart item');

    cartItem.quantity += quantity;

    if (cartItem.quantity <= 0) return await cartItem.destroy();

    await cartItem.save();

    return cartItem;
  }
}
