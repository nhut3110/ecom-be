import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import {
  BaseFindManyDto,
  ProductSortField,
  SortDirection,
} from 'src/constants';

export class FindManyProductDto extends BaseFindManyDto {
  @IsString()
  @IsOptional()
  @IsEnum(ProductSortField)
  sortBy = 'id';

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection = 'ASC';

  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  title = '';
}
