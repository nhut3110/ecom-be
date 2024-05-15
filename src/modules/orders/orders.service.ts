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
import { DiscountService } from '../discounts/discounts.service';
import { ProductService } from '../products/products.service';
import { AppConfigService } from '../config/app-config.service';
import moment from 'moment';
import crypto, { BinaryLike } from 'crypto';
import {
  InpOrderAlreadyConfirmed,
  IpnFailChecksum,
  IpnInvalidAmount,
  ReturnQueryFromVNPay,
  VNPay,
  VerifyReturnUrl,
} from 'vnpay';
import { User } from '../users/user.entity';

export const HashAlgorithm = {
  SHA256: 'SHA256',
  SHA512: 'SHA512',
  MD5: 'MD5',
} as const;

export type HashAlgorithm = typeof HashAlgorithm[keyof typeof HashAlgorithm];

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private orderDetailModel: typeof OrderDetail,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private cartService: CartService,
    private mailService: MailService,
    private productService: ProductService,
    private discountService: DiscountService,
    private appConfigService: AppConfigService,
  ) {}

  private vnpay = new VNPay({
    tmnCode: this.appConfigService.vnpayTmnCode,
    secureSecret: this.appConfigService.vnpayHashSecret,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional
    hashAlgorithm: 'SHA512', // optional
  });

  async estimateAmount(userId: string, userDiscountId?: string) {
    const cartData = await this.cartService.get(userId);

    if (!cartData.length) {
      throw new BadRequestException(
        'Cannot create an order with an empty cart',
      );
    }

    let totalAmount = cartData.reduce(
      (sum, item) =>
        sum +
        (item.product.price -
          (item.product.price * item.product.discountPercentage) / 100) *
          item.quantity,
      0,
    );

    if (userDiscountId) {
      totalAmount = await this.discountService.applyDiscount(
        userDiscountId,
        totalAmount,
      );
    }

    return totalAmount;
  }

  async create(userId: string, orderData: OrderDto): Promise<Order> {
    const cartData = await this.cartService.get(userId);

    if (!cartData.length) {
      throw new BadRequestException(
        'Cannot create an order with an empty cart',
      );
    }

    let totalAmount = cartData.reduce(
      (sum, item) =>
        sum +
        (item.product.price -
          (item.product.price * item.product.discountPercentage) / 100) *
          item.quantity,
      0,
    );

    if (orderData.discountId) {
      totalAmount = await this.discountService.applyDiscount(
        orderData.discountId,
        totalAmount,
      );
    }

    if (totalAmount !== orderData.amount) {
      throw new BadRequestException('Incorrect amount provided');
    }

    const transaction: Transaction =
      await this.orderModel.sequelize.transaction();

    try {
      // Check and update product quantities
      for (const item of cartData) {
        const product = await this.productService.findOne(item.product.id);
        if (product.availableQuantity < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product ${product.title}`,
          );
        }

        // Update the product's available quantity
        await this.productService.update(item.product.id, {
          availableQuantity: product.availableQuantity - item.quantity,
        });
      }

      const order = await this.orderModel.create({ ...orderData, userId });

      const orderDetails: OrderDetails[] = cartData.map((item) => {
        return {
          orderId: order.id,
          productId: item.product.id,
          quantity: item.quantity,
        };
      });

      await this.orderDetailModel.bulkCreate(orderDetails, { transaction });

      // Use the discount if applicable
      if (orderData.discountId) {
        await this.discountService.useDiscount(orderData.discountId);
      }

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

  async cancel(id: string, userId: string): Promise<Order> {
    const transaction: Transaction =
      await this.orderModel.sequelize.transaction();

    try {
      const order = await this.getById(id, userId);
      if (!order) {
        throw new BadRequestException('Order not found');
      }

      // Restore product quantities
      for (const detail of order.orderDetails) {
        const backedQuantity =
          Number(detail.product.availableQuantity) + Number(detail.quantity);

        await this.productService.update(detail.product.id as any, {
          availableQuantity: backedQuantity,
        });
      }

      // Revert discount usage if applicable
      if (order.discountId) {
        await this.discountService.backOneUsageCount(order.discountId);
      }

      order.orderStatus = OrderStatus.CANCELED;
      await order.save({ transaction });

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateStatus(id: string, userId: string, status: OrderStatus) {
    const order = await this.getById(id, userId);

    order.orderStatus = status;
    await order.save();
  }

  async setComplete(id: string, userId: string): Promise<Order> {
    const exchangeRatio = this.appConfigService.shippingPointRatio;
    const transaction = await this.orderModel.sequelize.transaction();

    try {
      const order = await this.getById(id, userId);

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      if (order.orderStatus === OrderStatus.CANCELED) {
        throw new BadRequestException('Order canceled');
      }

      order.orderStatus = OrderStatus.COMPLETED;
      await order.save({ transaction });

      // Calculate the additional shipping points
      const additionalPoints = order.amount / exchangeRatio;

      // Find the user and update their shipping points
      const user = await this.userModel.findOne({
        where: { id: userId },
        transaction,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      user.shippingPoint = (user.shippingPoint || 0) + additionalPoints;
      await user.save({ transaction });

      // Send the order completion mail
      await this.mailService.sendOrderMail(order.address.email, order);

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(
        `Failed to complete order: ${error.message}`,
      );
    }
  }

  hash(secret: string, data: BinaryLike, algorithm: HashAlgorithm): string {
    return crypto.createHmac(algorithm, secret).update(data).digest('hex');
  }

  async createPaymentUrl(props: {
    orderId: string;
    userId: string;
    bankCode?: string;
    language?: 'vn' | 'en';
    ip?: string;
  }): Promise<string> {
    const {
      orderId,
      userId,
      bankCode,
      language = 'vn',
      ip = '127.0.0.1',
    } = props;

    const order = await this.getById(orderId, userId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const returnUrl = this.appConfigService.vnpayReturnUrl;

    // Prepare parameters
    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_Locale: language,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderId,
      vnp_OrderType: 'other',
      vnp_Amount: order.amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ip,
    };

    // Add the bank code if provided
    if (bankCode) {
      vnpParams['vnp_BankCode'] = bankCode;
    }

    const redirectUrl = this.vnpay.buildPaymentUrl(vnpParams);

    return redirectUrl.toString();
  }

  async verifyPayment(data: ReturnQueryFromVNPay, userId: string) {
    try {
      const verify: VerifyReturnUrl = this.vnpay.verifyIpnCall({ ...data });
      if (!verify.isVerified) {
        throw new BadRequestException(IpnFailChecksum);
      }
      const order = await this.getById(data.vnp_TxnRef, userId);
      if (!order) {
        throw new BadRequestException('Order not found');
      }

      if (verify.vnp_Amount !== order.amount) {
        throw new BadRequestException(IpnInvalidAmount);
      }

      if (order.orderStatus === OrderStatus.COMPLETED) {
        throw new BadRequestException(InpOrderAlreadyConfirmed);
      }

      if (order.orderStatus !== OrderStatus.PENDING) {
        throw new BadRequestException('Order already paid');
      }

      return await this.updateStatus(order.id, userId, OrderStatus.PAID);
    } catch (error) {
      console.log(`verify error: ${error}`);
      throw new BadRequestException(`verify error: ${error}`);
    }
  }

  async verifyReturn(data: ReturnQueryFromVNPay) {
    let verify: VerifyReturnUrl;
    try {
      verify = this.vnpay.verifyReturnUrl({ ...data });
      if (!verify.isVerified) {
        return {
          message: verify?.message ?? 'Payment failed!',
          status: verify.isSuccess,
        };
      }
    } catch (error) {
      console.log(`verify error: ${error}`);
      return { message: 'verify error', status: false };
    }

    return {
      message: verify?.message ?? 'Payment successful!',
      status: verify.isSuccess,
    };
  }
}
