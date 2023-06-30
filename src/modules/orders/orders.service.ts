import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderDetailDto, OrderDto } from './dto/order.dto';
import {
  OrderStatus,
  PaymentTypes,
  orderAttributes,
  responseRelatedAttributes,
} from './order.constant';
import { CartService } from '../carts/carts.service';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    private cartService: CartService,
  ) {}

  async create(orderData: OrderDto): Promise<Order> {
    const cartData = await this.cartService.get(orderData.userId);

    if (orderData.paymentType === PaymentTypes.CARD && !orderData.paymentId)
      throw new BadRequestException('Lacking payment information');

    const order = await this.orderModel.create(orderData);

    const orderDetails: OrderDetailDto[] = cartData.map((item) => {
      return {
        orderId: order.id,
        productId: item.product.id,
        quantity: item.quantity,
      };
    });

    await this.orderDetailModel.bulkCreate(orderDetails);
    await this.cartService.clear(orderData.userId);

    return this.getById(order.id);
  }

  getById(id: string): Promise<Order | null> {
    return this.orderModel.findOne({
      where: { id },
      include: responseRelatedAttributes,
      attributes: orderAttributes,
    });
  }

  getByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { userId },
      include: responseRelatedAttributes,
      attributes: orderAttributes,
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.orderModel.update(
      { orderStatus: status },
      {
        where: { id },
      },
    );

    return this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    return !!(await this.orderModel.destroy({
      where: { id: id },
    }));
  }
}
