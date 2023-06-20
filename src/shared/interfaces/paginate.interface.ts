export interface PaginateResult<T> {
  data: T[];
  pagination: {
    total: number;
    nextCursor?: string | number | Date;
  };
}
