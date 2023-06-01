import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  @ApiProperty()
  email: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(64)
  @ApiProperty()
  password?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @ApiProperty()
  picture?: string;

  @IsNumber()
  @ApiProperty()
  shippingPoint?: number;

  @IsString()
  @ApiProperty()
  provider?: string;
}
