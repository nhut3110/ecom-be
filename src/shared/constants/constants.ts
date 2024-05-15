export const enum AccountTypes {
  LOCAL = 'local',
  THIRD_PARTY = 'third_party',
}

export const enum JwtTokenTypes {
  REFRESH = 'refresh',
  ACCESS = 'access',
}

export const TOKEN_PREFIX = 'tokens';
export const OTP_PREFIX = 'otp';

export const REDIS_TOKEN = 'REDIS';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const MAX_FAVORITE = 100;
