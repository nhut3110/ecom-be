import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/modules/categories/entities/category.entity';

@Table({ tableName: 'products', timestamps: false })
export class Product extends Model<Product> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID, allowNull: false })
  category_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  rate: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  count: number;

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
