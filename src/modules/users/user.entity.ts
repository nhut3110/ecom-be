import { Exclude } from 'class-transformer';
import { Table, Column, DataType, Scopes, HasMany } from 'sequelize-typescript';
import { TimestampBaseModel } from 'src/shared/entities/timestamp.entity';
import { UserDiscount } from '../discounts/user_discount.entity';

@Scopes(() => ({
  withoutPassword: {
    attributes: { exclude: ['password'] },
  },
}))
@Table({ tableName: 'users', timestamps: false })
export class User extends TimestampBaseModel<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    field: 'shipping_point',
  })
  shippingPoint: number;

  @Column({
    type: DataType.ENUM,
    values: ['local', 'third_party'],
    defaultValue: 'local',
  })
  provider: string;

  @HasMany(() => UserDiscount)
  userDiscounts: UserDiscount[];
}
