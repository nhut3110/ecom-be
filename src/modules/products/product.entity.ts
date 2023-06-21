import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/modules/categories/category.entity';
import { TimestampBaseModel } from 'src/shared';
import { Favorite } from '../favorites/favorite.entity';

@Table({ tableName: 'products', timestamps: false })
export class Product extends TimestampBaseModel<Product> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID, allowNull: false, field: 'category_id' })
  categoryId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  rate: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  count: number;

  @HasMany(() => Favorite)
  favorite: Favorite[];
}
