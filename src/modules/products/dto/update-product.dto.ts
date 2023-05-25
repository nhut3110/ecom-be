import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @ApiProperty()
  title?: string;

  @IsNumber()
  @ApiProperty()
  price?: number;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsString()
  @ApiProperty()
  category_id?: string;

  @IsString()
  @ApiProperty()
  image?: string;

  @IsNumber()
  @ApiProperty()
  rate?: number;

  @IsNumber()
  @ApiProperty()
  count?: number;
}
