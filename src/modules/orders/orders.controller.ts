import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
  Ip,
  Query,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';
import { Order } from './entities/order.entity';
import { ReturnQueryFromVNPay } from 'vnpay';

@Controller('orders')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/payment-url')
  async generatePaymentUrl(
    @Ip() ip,
    @Param('id') id: string,
    @UserData('id') userId: string,
    @Body('bankCode') bankCode?: string,
    @Body('language') language?: 'vn' | 'en',
  ): Promise<{ paymentUrl: string }> {
    // console.log('user ip:', ip);
    const paymentUrl = await this.ordersService.createPaymentUrl({
      orderId: id,
      userId,
      bankCode,
      language,
      ip,
    });

    return { paymentUrl };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true })) orderData: OrderDto,
    @UserData('id') userId: string,
  ): Promise<Order> {
    return this.ordersService.create(userId, orderData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify-ipn')
  async verifyIpn(
    @UserData('id') userId: string,
    @Query() request: ReturnQueryFromVNPay,
  ) {
    return await this.ordersService.verifyPayment(request, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/estimate-amount')
  async estimateAmount(
    @UserData('id') userId: string,
    @Query('discountId') discountId?: string,
  ): Promise<{ estimatedAmount: number }> {
    const totalAmount = await this.ordersService.estimateAmount(
      userId,
      discountId,
    );

    return { estimatedAmount: totalAmount };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/verify-url')
  async verifyUrl(@Query() request: ReturnQueryFromVNPay) {
    return await this.ordersService.verifyReturn(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(
    @Param('id') id: string,
    @UserData('id') userId: string,
  ): Promise<Order> {
    return this.ordersService.getById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByUserId(@UserData('id') userId: string): Promise<Order[]> {
    return this.ordersService.getByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  updateStatus(
    @Param('id') id: string,
    @UserData('id') userId: string,
  ): Promise<Order> {
    return this.ordersService.cancel(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  updateComplete(
    @Param('id') id: string,
    @UserData('id') userId: string,
  ): Promise<Order> {
    return this.ordersService.setComplete(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @UserData('id') userId: string,
    @Body() updateOrderDto: OrderDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      userId,
      updateOrderDto.orderStatus,
    );
  }
}
