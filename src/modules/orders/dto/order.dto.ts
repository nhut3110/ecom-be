import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentTypes } from '../order.constant';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  addressId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  paymentId: string;

  @IsEnum(PaymentTypes)
  @IsNotEmpty()
  @ApiProperty()
  paymentType: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  @ApiProperty()
  orderStatus: OrderStatus;
}

export class OrderDetailDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;
}
