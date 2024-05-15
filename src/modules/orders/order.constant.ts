import { Address } from '../addresses/address.entity';
import { UserDiscount } from '../discounts/user_discount.entity';
import { Payment } from '../payment/payment.entity';
import { Product } from '../products/product.entity';
import { OrderDetail } from './entities/order-detail.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export const orderAttributes = [
  'id',
  'createdAt',
  'orderStatus',
  'paymentType',
  'description',
  'amount',
];

export const orderDetailAttributes = ['quantity'];

export const orderProductAttributes = [
  'id',
  'price',
  'image',
  'title',
  'availableQuantity',
];

export const responseRelatedAttributes = [
  {
    model: OrderDetail,
    include: [{ model: Product, attributes: orderProductAttributes }],
    attributes: orderDetailAttributes,
  },
  {
    model: Address,
    attributes: ['name', 'email', 'phoneNumber', 'address'],
  },
  { model: Payment, attributes: ['cardNumber'] },
  { model: UserDiscount },
];
export enum PaymentTypes {
  CASH = 'cash',
  CARD = 'vnpay',
}
