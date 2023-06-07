import jwtDecode from 'jwt-decode';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/modules/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { JwtPayload } from '../auth/types/token-payload.type';
import { Tokens } from '../auth/types/token.type';
import { convertTimeToSeconds } from 'src/utils/convertTimeToSeconds';
import { ITokens } from './interfaces/tokens.interface';
import { IJwtDecode } from './interfaces/jwt-decode.interface';
import { JwtTokenTypes } from 'src/constants';

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
    const tokenPair: ITokens = {
      accessToken,
      refreshToken,
    };
    const existingTokens = (await this.redisService.get(userId)) as string;
    const tokenList = existingTokens ? JSON.parse(existingTokens) : [];
    tokenList.push(tokenPair);
    const ttl = convertTimeToSeconds(this.appConfigService.jwtRefreshExpiresIn);
    const tokenValue = JSON.stringify(tokenList);

    return await this.redisService.set(userId, tokenValue, { ttl: ttl });
  }

  async getTokenPairs(userId: string) {
    const tokenList = (await this.redisService.get(userId)) as string;
    return tokenList ? JSON.parse(tokenList) : [];
  }

  async revokeToken(userId: string, refreshToken: string) {
    const tokenList = (await this.redisService.get(userId)) as string;
    if (tokenList) {
      const parsedTokenList = JSON.parse(tokenList);
      const updatedTokenList = parsedTokenList.filter(
        (tokenPair: any) => tokenPair.refreshToken !== refreshToken,
      );

      return await this.redisService.set(
        userId,
        JSON.stringify(updatedTokenList),
      );
    }

    return null;
  }

  async isTokenValid(
    userId: string,
    token: string,
    tokenType: JwtTokenTypes,
  ): Promise<boolean> {
    const tokenList = (await this.redisService.get(userId)) as string;

    if (tokenList) {
      const parsedTokenList = JSON.parse(tokenList);

      return await parsedTokenList.some((tokenPair: ITokens) => {
        if (tokenType === JwtTokenTypes.ACCESS) {
          return tokenPair.accessToken === token;
        } else if (tokenType === JwtTokenTypes.REFRESH) {
          return tokenPair.refreshToken === token;
        }
      });
    }

    return false;
  }

  async requestRefreshTokens(requestedRefreshToken: string): Promise<Tokens> {
    const decodedData: IJwtDecode = jwtDecode(requestedRefreshToken);
    const { id } = decodedData;

    const isValidToken = await this.isTokenValid(
      id,
      requestedRefreshToken,
      JwtTokenTypes.REFRESH,
    );
    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    await this.revokeToken(id, requestedRefreshToken);

    return await this.getTokens(decodedData.id);
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
