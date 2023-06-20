import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { SortDirection } from '../constants/constants';

export class BaseFindManyDto {
  @IsString()
  @IsOptional()
  sortBy: string;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection = 'ASC';

  @IsString()
  @IsOptional()
  cursor: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
