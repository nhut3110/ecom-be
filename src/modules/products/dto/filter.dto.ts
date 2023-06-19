import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsDefined,
  IsNumber,
} from 'class-validator';
import { SortDirection } from 'src/constants';

export class FilterDto {
  @IsString()
  @IsOptional()
  sortBy: string;

  @IsEnum(SortDirection)
  @ValidateIf((object) => object.sortBy !== undefined)
  @IsDefined()
  sortDirection: string;

  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  searchTitle: string;

  @IsString()
  @IsOptional()
  cursor: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
