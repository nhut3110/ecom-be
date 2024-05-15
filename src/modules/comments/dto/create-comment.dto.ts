import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Great product!' })
  text: string;

  @IsNumber()
  @ApiProperty({ example: 4.5 })
  rating: number;

  @IsOptional()
  imageFiles?: Express.Multer.File[];
}

export class CreateReactionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  commentId: string;

  @IsEnum(['like', 'dislike'])
  @ApiProperty({ example: 'like', enum: ['like', 'dislike'] })
  type: 'like' | 'dislike';
}

export class ReportCommentDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  commentId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'This comment is inappropriate.' })
  reason: string;
}
