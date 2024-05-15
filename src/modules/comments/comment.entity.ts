import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { TimestampBaseModel } from 'src/shared';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Table({ tableName: 'comments', timestamps: false })
export class Comment extends TimestampBaseModel<Comment> {
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

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  rating: number;

  @HasMany(() => CommentImage)
  images: CommentImage[];

  @HasMany(() => CommentReaction)
  reactions: CommentReaction[];

  @HasMany(() => CommentReport)
  reports: CommentReport[];

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  likeCount: string;

  dislikeCount: string;

  isCurrentUserReported: boolean;
}

@Table({ tableName: 'comment_images', timestamps: false })
export class CommentImage extends TimestampBaseModel<CommentImage> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.UUID, allowNull: false, field: 'comment_id' })
  commentId: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: 'image_url' })
  imageUrl: string;
}

@Table({
  tableName: 'comment_reactions',
  timestamps: false,
})
export class CommentReaction extends TimestampBaseModel<CommentReaction> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'comment_id',
  })
  commentId: string;

  @Column({
    type: DataType.ENUM('like', 'dislike'),
    allowNull: false,
  })
  type: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Comment)
  comment: Comment;
}

@Table({
  tableName: 'comment_reports',
  timestamps: false,
})
export class CommentReport extends TimestampBaseModel<CommentReport> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'reported_by_user_id',
  })
  reportedByUserId: string;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'comment_id',
  })
  commentId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reason: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  resolved: boolean;

  @BelongsTo(() => User)
  reportedByUser: User;

  @BelongsTo(() => Comment)
  comment: Comment;
}
