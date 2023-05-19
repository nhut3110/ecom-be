import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @ApiProperty()
  id?: string;

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

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @ApiProperty()
  password: string;

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
