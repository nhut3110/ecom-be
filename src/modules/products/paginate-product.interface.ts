import { Product } from './product.entity';

export interface IPaginateResult {
  data: Product[];
  pagination: {
    total: number;
    nextCursor: string | number | Date | undefined;
  };
}
