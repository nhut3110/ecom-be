import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  shippingPoint?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  picture?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  password?: string;
}
