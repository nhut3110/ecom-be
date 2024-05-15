import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'LEGO Millennium Falcon' })
  title?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ example: 159.99 })
  price?: number;

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
  image?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/thumbnail.png' })
  thumbnail_url?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  category_id?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @ApiProperty({ example: 4.5, required: false })
  rate?: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 10, required: false })
  count?: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 20.0 })
  discountPercentage?: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 200 })
  availableQuantity?: number;
}
