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

export const enum SortValues {
  AZ = 'AZ',
  ZA = 'ZA',
  PRICE_ASC = 'PriceASC',
  PRICE_DESC = 'PriceDESC',
  RATE_ASC = 'RateASC',
  RATE_DESC = 'RateDESC',
}
