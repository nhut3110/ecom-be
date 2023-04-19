import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Role } from 'src/common/constants/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string;
  password?: string;
  refreshToken?: string;
  roles?: Role[];
}
