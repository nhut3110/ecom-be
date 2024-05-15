import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { TimestampBaseModel } from 'src/shared';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Table({ tableName: 'discussions', timestamps: false })
export class Discussion extends TimestampBaseModel<Discussion> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  productId: string;

  @ForeignKey(() => Discussion)
  @Column({ type: DataType.UUID, allowNull: true, field: 'parent_id' })
  parentId: string; // Reference to the parent discussion

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @HasMany(() => Discussion, 'parentId')
  replies: Discussion[];

  @BelongsTo(() => Discussion, 'parentId')
  parent: Discussion;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}
