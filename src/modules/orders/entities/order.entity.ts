import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/user.entity';
import { Address } from '../../addresses/address.entity';
import { Payment } from '../../payment/payment.entity';
import { TimestampBaseModel } from 'src/shared';
import { OrderStatus } from '../order.constant';
import { OrderDetail } from './order-detail.entity';

@Table({ tableName: 'orders' })
export class Order extends TimestampBaseModel<Order> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.UUID,
    field: 'address_id',
    allowNull: false,
  })
  addressId: string;

  @BelongsTo(() => Address)
  address: Address;

  @ForeignKey(() => Payment)
  @Column({
    type: DataType.UUID,
    field: 'payment_id',
    allowNull: true,
  })
  paymentId: string;

  @BelongsTo(() => Payment)
  payment: Payment;

  @Column({
    type: DataType.ENUM('cash', 'card'),
    allowNull: false,
    field: 'payment_type',
  })
  paymentType: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(
      'pending',
      'confirmed',
      'paid',
      'shipping',
      'completed',
      'canceled',
    ),
    allowNull: true,
    defaultValue: 'pending',
    field: 'order_status',
  })
  orderStatus: OrderStatus;

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];
}
