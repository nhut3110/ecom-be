import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';

import { TimestampBaseModel } from 'src/constants/base-entities/timestamp.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Table({ tableName: 'favorites' })
export class Favorite extends TimestampBaseModel<Favorite> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id', allowNull: false })
  userId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, field: 'product_id', allowNull: false })
  productId: string;
}
