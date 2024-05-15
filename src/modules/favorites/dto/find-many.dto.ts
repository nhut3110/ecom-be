import { IsString, IsUUID, IsEnum, IsOptional, IsArray } from 'class-validator';
import { BaseFindManyDto } from 'src/shared';

export class FindManyFavoriteDto extends BaseFindManyDto {
  @IsString()
  @IsOptional()
  @IsEnum(['price', 'id', 'rate', 'updatedAt'])
  sortBy = 'id';

  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  productId: string;

  @IsString()
  @IsOptional()
  title = '';
}
