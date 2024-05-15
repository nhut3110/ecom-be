import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { UserDiscount } from './user_discount.entity'; // Adjust the import path as necessary
import { TimestampBaseModel } from 'src/shared';

@Table({ tableName: 'discounts', timestamps: false })
export class Discount extends TimestampBaseModel<Discount> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({
    type: DataType.ENUM,
    values: ['percentage', 'fixed', 'tiered'],
    allowNull: false,
    field: 'discount_type',
  })
  discountType: string;

  @Column({ type: DataType.FLOAT, allowNull: false, field: 'discount_value' })
  discountValue: number;

  @Column({ type: DataType.DATE, allowNull: false, field: 'start_date' })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'end_date' })
  endDate: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    field: 'min_purchase_amount',
  })
  minPurchaseAmount: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    field: 'max_discount_amount',
  })
  maxDiscountAmount: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  active: boolean;

  @HasMany(() => UserDiscount)
  userDiscounts: UserDiscount[];
}
