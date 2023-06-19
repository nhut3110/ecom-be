import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class BaseFindManyDto {
  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  sortDirection: string;

  @IsString()
  @IsOptional()
  cursor: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
