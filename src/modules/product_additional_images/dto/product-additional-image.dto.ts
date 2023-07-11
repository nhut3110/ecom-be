import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAdditionalImagesDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'UUID of the product this image is associated with.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  product_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/thumbnail.png' })
  thumbnail_url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com/image.png' })
  image_url: string;
}
