import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Address } from '../addresses/address.entity';
import { User } from '../users/user.entity';
import { OrderStatus } from './order.constant';
import { TimestampBaseModel } from 'src/shared';
import { Cart } from '../carts/cart.entity';

@Table({ tableName: 'orders' })
export class Order extends TimestampBaseModel<Order> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'address_id',
  })
  addressId: string;

  @BelongsTo(() => Address)
  addresses: Address;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_paid_by_card',
  })
  isPaidByCard: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'card_number',
  })
  cardNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'card_owner',
  })
  cardOwner: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'card_expired_date',
  })
  cardExpiredDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'card_cvc',
  })
  cardCvc: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'product_list',
  })
  productList: Cart[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'order_status',
  })
  orderStatus: OrderStatus;
}
