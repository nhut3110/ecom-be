import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './carts.service';
import { CartOutput } from './interfaces/card-output.interface';
import { CartDto } from './dto/cart.dto';
import { Cart } from './cart.entity';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('carts')
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCartByUserId(@UserData('id') userId: string): Promise<CartOutput> {
    return await this.cartsService.get(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addToCart(
    @UserData('id') userId: string,
    @Body() body: CartDto,
  ): Promise<Cart> {
    const { productId, quantity } = body;
    return await this.cartsService.addProductToCart({
      userId,
      productId,
      quantity,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':productId')
  async updateQuantity(
    @UserData('id') userId: string,
    @Param('productId') productId: string,
    @Query('quantity') quantity: number,
  ): Promise<Cart> {
    return await this.cartsService.updateQuantity({
      userId,
      productId,
      quantity,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async deleteProductFromCart(
    @UserData('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<number> {
    return await this.cartsService.removeProductFromCart(userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('clear/:userId')
  async clearCart(@UserData('id') userId: string): Promise<number> {
    return await this.cartsService.clear(userId);
  }
}
