import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DiscountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'SAVE10' })
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '10% off on your next purchase', required: false })
  description?: string;

  @IsEnum(['percentage', 'fixed', 'tiered'])
  @IsNotEmpty()
  @ApiProperty({ example: 'percentage' })
  discountType: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  discountValue: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  startDate: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ example: '2024-12-31T00:00:00Z', required: false })
  endDate?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 50.0, required: false })
  minPurchaseAmount?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 20.0, required: false })
  maxDiscountAmount?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  active: boolean;
}
