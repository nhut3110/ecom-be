import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { BaseFindManyDto } from 'src/shared';

export class FindManyProductDto extends BaseFindManyDto {
  @IsString()
  @IsOptional()
  @IsEnum(['price', 'id', 'rate'])
  sortBy = 'id';

  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  title = '';
}
