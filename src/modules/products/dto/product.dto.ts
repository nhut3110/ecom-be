import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
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
  @IsUUID()
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
