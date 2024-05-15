import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
  IsEnum,
  IsString,
  IsArray,
} from 'class-validator';
import { BaseFindManyDto } from 'src/shared';

export class FindManyProductDto extends BaseFindManyDto {
  @IsEnum(['price', 'id', 'rate', 'year', 'discountPercentage'])
  @IsOptional()
  sortBy = 'id';

  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  title = '';

  @IsNumber()
  @IsOptional()
  @Type(() => Number) // Ensure 'year' is treated as a number
  year: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999999999999)
  @Type(() => Number) // Ensure 'minPrice' is treated as a number
  minPrice: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999999999999)
  @Type(() => Number) // Ensure 'maxPrice' is treated as a number
  maxPrice: number;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : JSON.parse(value)))
  exceptedProducts: string[];
}
