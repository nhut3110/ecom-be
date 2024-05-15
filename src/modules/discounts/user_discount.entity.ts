import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity'; // Adjust import path as necessary
import { Discount } from './discount.entity';
import { TimestampBaseModel } from 'src/shared';

@Table({ tableName: 'user_discounts', timestamps: false })
export class UserDiscount extends TimestampBaseModel<UserDiscount> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ForeignKey(() => Discount)
  @Column({ type: DataType.UUID, allowNull: false, field: 'discount_id' })
  discountId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'usage_count',
  })
  usageCount: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Discount)
  discount: Discount;
}
