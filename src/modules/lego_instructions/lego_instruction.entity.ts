import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Product } from 'src/modules/products/product.entity'; // Adjust import path as necessary
import { TimestampBaseModel } from 'src/shared';

@Table({ tableName: 'instructions', timestamps: false })
export class Instruction extends TimestampBaseModel<Instruction> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  productId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'img_url' })
  imgUrl: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'instruction_url' })
  instructionUrl: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'sequence_total',
  })
  sequenceTotal: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'sequence_element',
  })
  sequenceElement: number;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'modified_date',
  })
  modifiedDate: Date;
}
