import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'categories', timestamps: false })
export class Category extends Model<Category> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

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
