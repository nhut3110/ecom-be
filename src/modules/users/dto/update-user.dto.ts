import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @ApiProperty()
  shippingPoint?: number;

  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  picture?: string;
}
