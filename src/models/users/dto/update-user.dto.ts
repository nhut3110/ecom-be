import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string;

  @MinLength(8)
  @MaxLength(64)
  password?: string;

  refreshToken?: string;
}
