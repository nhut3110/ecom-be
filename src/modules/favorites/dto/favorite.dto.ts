import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  productId: string;
}
