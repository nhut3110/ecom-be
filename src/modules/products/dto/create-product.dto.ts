import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
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
