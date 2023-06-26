import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CartQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
