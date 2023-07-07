import { Address } from '../addresses/address.entity';
import { Payment } from '../payment/payment.entity';
import { Product } from '../products/product.entity';
import { OrderDetail } from './entities/order-detail.entity';

export enum OrderStatus {
  'pending',
  'confirmed',
  'paid',
  'shipping',
  'completed',
  CANCELED = 'canceled',
}

export const orderAttributes = [
  'id',
  'createdAt',
  'orderStatus',
  'paymentType',
  'description',
];

export const orderDetailAttributes = ['quantity'];

export const orderProductAttributes = ['id', 'price', 'image', 'title'];

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
];
export enum PaymentTypes {
  CASH = 'cash',
  CARD = 'card',
}
