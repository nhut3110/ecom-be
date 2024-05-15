import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'LEGO Millennium Falcon' })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ example: 159.99 })
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This is a description of the product.',
    required: false,
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/image.png' })
  image: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/thumbnail.png' })
  thumbnail_url: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  category_id: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 4.5, required: false })
  rate?: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 10, required: false })
  count?: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 42 })
  set_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'XYZ123' })
  number_id: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 100 })
  pieces: number;

  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  @ApiProperty({ example: 2022 })
  year: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 2 })
  instructions_count: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 4 })
  minifigs: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 15.5 })
  height: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 8.5 })
  depth: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 22.2 })
  width: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 20.0 })
  discountPercentage: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 200 })
  availableQuantity: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1.2 })
  weight: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1.2 })
  ageRange: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1.2 })
  additionalImageCount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This is a description of the product.',
  })
  barcode?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This is a description of the product.',
  })
  packagingType?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'This is a description of the product.',
  })
  availability?: string;
}
