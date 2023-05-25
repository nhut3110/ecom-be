import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @IsString()
  @ApiProperty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsNumber()
  @ApiProperty()
  rate?: number;

  @IsNumber()
  @ApiProperty()
  count?: number;
}
