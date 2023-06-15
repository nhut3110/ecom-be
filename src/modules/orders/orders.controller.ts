import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/orders.dto';
import { Order } from './order.entity';
import { IdDto } from '../users/dto/id.dto';
import { OrderStatus } from './order.constant';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('/list/:userId')
  async getListByUserId(@Param('userId') userId: string): Promise<Order[]> {
    return await this.orderService.getListByUserId(userId);
  }

  @Get(':id')
  async get(@Param('id') id: IdDto): Promise<Order> {
    return await this.orderService.get(id);
  }

  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body() body: OrderDTO,
  ): Promise<Order> {
    return await this.orderService.create(userId, body);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: IdDto,
    @Query('status') status: OrderStatus,
  ): Promise<Order> {
    console.log(status);
    return await this.orderService.updateStatus(id, status);
  }

  @Patch('cancel/:id')
  async cancel(@Param('id') id: IdDto) {
    return await this.orderService.cancel(id);
  }
}
