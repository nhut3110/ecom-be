import jwtDecode from 'jwt-decode';
import ms from 'ms';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/modules/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { JwtPayload } from '../auth/types/token-payload.type';
import { Tokens } from '../auth/types/token.type';
import { IJwtDecode } from './interfaces/jwt-decode.interface';
import { TOKEN_PREFIX } from 'src/constants';
import { StringValue } from 'ms';

@Injectable()
export class TokensService {
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async storeTokenPair(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    const key = TOKEN_PREFIX + ':' + userId;
    const tokenPair = accessToken + ':' + refreshToken;
    const expirationTime =
      ms(this.appConfigService.jwtRefreshExpiresIn as StringValue) +
      Math.floor(Date.now());

    await this.deleteExpiredPairs(userId);

    return await this.redisService.zAdd(key, expirationTime, tokenPair);
  }

  deleteExpiredPairs(userId: string): Promise<number> {
    const key = TOKEN_PREFIX + ':' + userId;
    const currentTime = Math.floor(Date.now());

    return this.redisService.zRemRangeByScore(key, '-inf', currentTime);
  }

  async getTokenPairsByUserId(userId: string): Promise<string[]> {
    const key = TOKEN_PREFIX + ':' + userId;
    await this.deleteExpiredPairs(userId);

    return await this.redisService.zRange(key, 0, -1);
  }

  revokePair(userId: string, pair: string) {
    const key = TOKEN_PREFIX + ':' + userId;
    return this.redisService.zRem(key, pair);
  }

  async validateAndRemovePair(
    userId: string,
    token: string,
    isRemoved?: boolean,
  ): Promise<boolean> {
    const tokenPairs = await this.getTokenPairsByUserId(userId);

    const foundTokenPair = tokenPairs.find((tokenPair) =>
      tokenPair.includes(token),
    );

    if (foundTokenPair) {
      isRemoved && (await this.revokePair(userId, foundTokenPair));
      return true;
    }

    return false;
  }

  async requestRefreshTokens(requestedRefreshToken: string): Promise<Tokens> {
    const decodedData: IJwtDecode = jwtDecode(requestedRefreshToken);
    const { id } = decodedData;
    const isValidToken = await this.validateAndRemovePair(
      id,
      requestedRefreshToken,
      true,
    );
    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    return await this.getTokens(id);
  }

  signJWTToken({ id, duration }: JwtPayload): string {
    const token = this.jwtService.sign(
      {
        id,
      },
      {
        expiresIn: duration,
      },
    );

    return token;
  }

  async getTokens(id: string): Promise<Tokens> {
    const accessToken = this.signJWTToken({
      id: id,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = this.signJWTToken({
      id: id,
      duration: this.appConfigService.jwtRefreshExpiresIn,
    });

    await this.storeTokenPair(id, accessToken, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }
}
