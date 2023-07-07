import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { TimestampBaseModel } from 'src/shared';

@Table({ tableName: 'payments' })
export class Payment extends TimestampBaseModel<Payment> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    field: 'card_number',
    allowNull: false,
  })
  cardNumber: string;

  @Column({
    type: DataType.STRING,
    field: 'card_owner',
    allowNull: false,
  })
  cardOwner: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cvc: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  expiry: string;
}
