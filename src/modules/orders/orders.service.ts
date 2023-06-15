import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.entity';
import { CartService } from '../carts/carts.service';
import { OrderDTO } from './dto/orders.dto';
import { Address } from '../addresses/address.entity';
import { OrderStatus } from './order.constant';
import { IdDto } from '../users/dto/id.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    private readonly cartService: CartService,
  ) {}

  async create(userId: string, orderInfo: OrderDTO): Promise<Order> {
    const productList = await this.cartService.get(userId);
    if (!productList) throw new BadRequestException('Empty cart');

    await this.cartService.clear(userId);

    return await this.orderModel.create({ ...orderInfo, productList, userId });
  }

  async get(id: IdDto): Promise<Order | null> {
    return this.orderModel.findOne({
      where: { id: id },
      include: [Address],
    });
  }

  async getListByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { userId },
      include: [Address],
    });
  }

  async updateStatus(id: IdDto, orderStatus: OrderStatus): Promise<Order> {
    await this.orderModel.update(
      { orderStatus: orderStatus },
      { where: { id } },
    );

    return this.orderModel.findOne({ where: { id } });
  }

  async cancel(id: IdDto) {
    return this.orderModel.update(
      { orderStatus: OrderStatus.CANCELED },
      { where: { id } },
    );
  }
}
