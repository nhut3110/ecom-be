import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  @ApiProperty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
