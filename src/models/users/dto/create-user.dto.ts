import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/constants/role.enum';

export class CreateUserDto {
  // @IsString()
  // @ApiProperty()
  // id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  roles: Role[];
}
