import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsLongitude,
  IsLatitude,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNumber()
  @IsLongitude()
  @IsNotEmpty()
  @ApiProperty()
  lng: number;

  @IsNumber()
  @IsLatitude()
  @IsNotEmpty()
  @ApiProperty()
  lat: number;
}
