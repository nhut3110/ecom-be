import { Exclude } from 'class-transformer';
import { Table, Column, Model, DataType, Scopes } from 'sequelize-typescript';

@Scopes(() => ({
  withoutPassword: {
    attributes: { exclude: ['password'] },
  },
}))
@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
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
    values: ['local', 'facebook'],
    defaultValue: 'local',
  })
  provider: string;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updateAt: Date;
}
