import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FacebookLoginBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  callbackUrl: string;
}
