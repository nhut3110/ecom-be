import jwtDecode from 'jwt-decode';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/modules/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { JwtPayload } from '../auth/types/token-payload.type';
import { Tokens } from '../auth/types/token.type';
import { convertTimeToSeconds } from 'src/utils/convertTimeToSeconds';
import { IJwtDecode } from './interfaces/jwt-decode.interface';
import { tokenPrefix } from 'src/constants';
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
    const key = tokenPrefix + userId;
    const tokenPair = accessToken + ':' + refreshToken;
    const expirationTime =
      convertTimeToSeconds(
        this.appConfigService.jwtRefreshExpiresIn as StringValue,
      ) + Math.floor(Date.now() / 1000);

    await this.deleteExpiredPairs(userId);

    return await this.redisService.zAdd(key, expirationTime, tokenPair);
  }

  async deleteExpiredPairs(userId: string): Promise<number> {
    const key = tokenPrefix + userId;
    const currentTime = Math.floor(Date.now() / 1000);

    return await this.redisService.zRemRangeByScore(key, '-inf', currentTime);
  }

  async getTokenPairsByUserId(userId: string): Promise<string[]> {
    const key = tokenPrefix + userId;
    await this.deleteExpiredPairs(userId);

    return await this.redisService.zRange(key, 0, -1);
  }

  async revokePair(userId: string, pair: string) {
    const key = tokenPrefix + userId;
    return await this.redisService.zRem(key, pair);
  }

  async validateAndRemovePair(userId: string, token: string): Promise<boolean> {
    const tokenPairs = await this.getTokenPairsByUserId(userId);

    for (const tokenPair of tokenPairs) {
      if (tokenPair.includes(token)) {
        await this.revokePair(userId, tokenPair);
        return true;
      }
    }

    return false;
  }

  async requestRefreshTokens(requestedRefreshToken: string): Promise<Tokens> {
    const decodedData: IJwtDecode = jwtDecode(requestedRefreshToken);
    const { id } = decodedData;
    const isValidToken = await this.validateAndRemovePair(
      id,
      requestedRefreshToken,
    );
    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    return await this.getTokens(id);
  }

  async signJWTToken({ id, duration }: JwtPayload): Promise<string> {
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
    const accessToken = await this.signJWTToken({
      id: id,
      duration: this.appConfigService.jwtAccessExpiresIn,
    });

    const refreshToken = await this.signJWTToken({
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
