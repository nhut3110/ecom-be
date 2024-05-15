import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Updated review text' })
  text?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 3.5 })
  rating?: number;

  @IsOptional()
  imageFiles?: Express.Multer.File[];
}
