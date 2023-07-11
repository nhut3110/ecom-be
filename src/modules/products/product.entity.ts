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
import { ProductAdditionalImage } from '../product_additional_images/product_additional_image.entity';

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

  @Column({ type: DataType.STRING, allowNull: false, field: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ type: DataType.FLOAT, allowNull: true })
  rate: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  count: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'set_id',
  })
  setId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
    field: 'number_id',
  })
  numberId: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  pieces: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1975 })
  year: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'instructions_count',
  })
  instructionsCount: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  minifigs: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  height: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  depth: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  width: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  weight: number;

  @HasMany(() => ProductAdditionalImage)
  additionalImages: ProductAdditionalImage[];

  @HasMany(() => Favorite)
  favorite: Favorite[];
}
