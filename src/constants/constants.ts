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
  PRICE_ASC = 'PriceLH',
  PRICE_DESC = 'PriceHL',
  RATE_ASC = 'RateLH',
  RATE_DESC = 'RateHL',
  DEFAULT = 'Default',
}
