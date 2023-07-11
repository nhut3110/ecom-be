import { Transaction } from 'sequelize';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderDto } from './dto/order.dto';
import {
  OrderStatus,
  orderAttributes,
  responseRelatedAttributes,
} from './order.constant';
import { CartService } from '../carts/carts.service';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderDetails } from './order-detail.interface';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    private cartService: CartService,
    private mailService: MailService,
  ) {}

  async create(userId: string, orderData: OrderDto): Promise<Order> {
    const cartData = await this.cartService.get(userId);

    if (!cartData.length) {
      throw new BadRequestException(
        'Cannot create an order with an empty cart',
      );
    }

    const transaction: Transaction =
      await this.orderModel.sequelize.transaction();

    try {
      const order = await this.orderModel.create(
        { ...orderData, userId },
        { transaction },
      );

      const orderDetails: OrderDetails[] = cartData.map((item) => {
        return {
          orderId: order.id,
          productId: item.product.id,
          quantity: item.quantity,
        };
      });

      await this.orderDetailModel.bulkCreate(orderDetails, { transaction });

      await this.cartService.clear(userId);

      await transaction.commit();

      return this.getById(order.id, userId);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  getById(id: string, userId: string): Promise<Order | null> {
    return this.orderModel.findOne({
      where: { id, userId },
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

  async cancel(
    id: string,
    userId: string,
    status: OrderStatus,
  ): Promise<Order> {
    await this.orderModel.update(
      { orderStatus: status },
      {
        where: { id, userId },
      },
    );

    return this.getById(id, userId);
  }

  async setComplete(id: string, userId: string) {
    const order = await this.getById(id, userId);
    if (order.orderStatus === OrderStatus.CANCELED)
      throw new BadRequestException('Order canceled');

    order.orderStatus = OrderStatus.COMPLETED;
    await order.save();

    return await this.mailService.sendOrderMail(order.address.email, order);
  }
}
