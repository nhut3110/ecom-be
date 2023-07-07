import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './order.constant';
import { JwtAuthGuard } from 'src/middleware/guards/jwt-auth.guard';
import { UserData } from 'src/decorators/user-data.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true })) orderData: OrderDto,
    @UserData('id') userId: string,
  ): Promise<Order> {
    return this.ordersService.create(userId, orderData);
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
    return this.ordersService.cancel(id, userId, OrderStatus.CANCELED);
  }
}
