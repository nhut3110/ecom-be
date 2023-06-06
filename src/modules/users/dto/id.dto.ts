import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IdDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
