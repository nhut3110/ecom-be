import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  ValidateIf,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentTypes } from '../order.constant';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  addressId: string;

  @IsEnum(PaymentTypes)
  @IsNotEmpty()
  @ApiProperty()
  paymentType: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  discountId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiProperty()
  orderStatus: OrderStatus;
}
