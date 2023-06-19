export const enum AccountTypes {
  FACEBOOK = 'facebook',
  LOCAL = 'local',
}

export const enum JwtTokenTypes {
  REFRESH = 'refresh',
  ACCESS = 'access',
}

export const TOKEN_PREFIX = 'tokens';

export const REDIS_TOKEN = 'REDIS';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ProductSortField {
  PRICE = 'price',
  ID = 'id',
  TITLE = 'title',
  RATE = 'rate',
  UPDATED_AT = 'updatedAt',
}
