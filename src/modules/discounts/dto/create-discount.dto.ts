import { IsNotEmpty, IsNumber } from 'class-validator';
import { DiscountDto } from './discount.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto extends DiscountDto {}

export class CreateUserDiscountDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  usageCount: number;
}
