import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @ApiProperty()
  otp: string;
}
