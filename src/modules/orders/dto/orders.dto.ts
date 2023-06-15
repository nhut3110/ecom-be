import {
  IsBoolean,
  IsDateString,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Cart } from 'src/modules/carts/cart.entity';

export class OrderDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  addressId: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isPaidByCard: boolean;

  @IsOptional()
  @IsString()
  @Length(16, 19)
  @ApiProperty()
  cardNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  cardOwner?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  cardExpiredDate?: Date;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  @ApiProperty()
  cardCvc?: string;

  @IsJSON()
  @IsOptional()
  @ApiProperty()
  productList?: Cart[];
}
