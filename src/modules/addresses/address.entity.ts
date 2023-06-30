import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { TimestampBaseModel } from 'src/shared';

@Table({ tableName: 'addresses' })
export class Address extends TimestampBaseModel<Address> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lng: number;
}
