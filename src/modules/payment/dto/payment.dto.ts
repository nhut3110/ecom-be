import {
  IsString,
  IsNotEmpty,
  IsCreditCard,
  IsUppercase,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @IsString()
  @IsCreditCard()
  @IsNotEmpty()
  @ApiProperty()
  cardNumber: string;

  @IsString()
  @IsUppercase()
  @IsNotEmpty()
  @ApiProperty()
  cardOwner: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  @ApiProperty()
  cvc: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  expiry: string;
}
