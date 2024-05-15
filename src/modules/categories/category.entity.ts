import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { TimestampBaseModel } from 'src/shared';
import { Product } from '../products/product.entity';

@Table({ tableName: 'categories', timestamps: false })
export class Category extends TimestampBaseModel<Category> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => Product)
  products: Product[];
}
