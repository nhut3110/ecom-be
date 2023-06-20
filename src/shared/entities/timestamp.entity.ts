import { Column, DataType, Model } from 'sequelize-typescript';

export class TimestampBaseModel<T> extends Model<T> {
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt: Date;
}
