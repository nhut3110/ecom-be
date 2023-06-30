import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
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
    @Body() orderData: OrderDto,
    @UserData('id') userId: string,
  ): Promise<Order> {
    return this.ordersService.create({ ...orderData, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByUserId(@UserData('id') userId: string): Promise<Order[]> {
    return this.ordersService.getByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.ordersService.delete(id);
  }
}
