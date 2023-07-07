import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentTypes } from '../order.constant';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  addressId: string;

  @ValidateIf((obj) => obj.paymentType !== PaymentTypes.CASH)
  @IsNotEmpty({ message: 'Payment information is required' })
  @IsUUID()
  @ApiProperty()
  paymentId: string;

  @IsEnum(PaymentTypes)
  @IsNotEmpty()
  @ApiProperty()
  paymentType: string;
}
