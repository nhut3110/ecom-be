import { Product } from './product.entity';

export interface IPaginateResult {
  pageData: Product[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor: string | number | Date;
  };
}
