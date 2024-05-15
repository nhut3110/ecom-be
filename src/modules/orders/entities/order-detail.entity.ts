import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TimestampBaseModel } from 'src/shared';
import { Order } from './order.entity';
import { Product } from 'src/modules/products/product.entity';

@Table({ tableName: 'order_details', timestamps: false })
export class OrderDetail extends TimestampBaseModel<OrderDetail> {
  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, field: 'order_id', allowNull: false })
  orderId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, field: 'product_id', allowNull: false })
  productId: string;

  @Column({ type: DataType.NUMBER, allowNull: false })
  quantity: number;

  @BelongsTo(() => Product)
  product: Product;
}
