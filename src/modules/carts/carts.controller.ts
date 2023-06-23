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
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './carts.service';
import { CartDto } from './dto/cart.dto';
import { Cart } from './cart.entity';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('carts')
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCartByUserId(@UserData('id') userId: string): Promise<Cart[]> {
    return this.cartsService.get(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addToCart(
    @UserData('id') userId: string,
    @Body() body: CartDto,
  ): Promise<void | Cart> {
    const { productId, quantity } = body;
    return this.cartsService.addProductToCart({
      userId,
      productId,
      quantity,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':productId')
  updateQuantity(
    @UserData('id') userId: string,
    @Param('productId') productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<void | Cart> {
    return this.cartsService.updateQuantity({
      userId,
      productId,
      quantity,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  deleteProductFromCart(
    @UserData('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<number> {
    return this.cartsService.removeProductFromCart(userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('clear/:userId')
  clearCart(@UserData('id') userId: string): Promise<number> {
    return this.cartsService.clear(userId);
  }
}
