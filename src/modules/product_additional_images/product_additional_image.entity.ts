import {
  Column,
  DataType,
  ForeignKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { TimestampBaseModel } from 'src/shared';
import { Product } from '../products/product.entity';

@Table({ tableName: 'product_additional_images', timestamps: false })
export class ProductAdditionalImage extends TimestampBaseModel<ProductAdditionalImage> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  productId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'image_url' })
  imageUrl: string;

  @BelongsTo(() => Product)
  product: Product;
}
