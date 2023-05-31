import jwtDecode from 'jwt-decode';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { JwtPayload } from '../auth/types/token-payload.type';
import { Tokens } from '../auth/types/token.type';

@Injectable()
export class TokensService {
  constructor(
    private redisService: RedisService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async requestRefreshTokens(requestedRefreshToken: string): Promise<Tokens> {
    const decodedData: any = jwtDecode(requestedRefreshToken);

    const lastToken = await this.redisService.get(decodedData.id);
    if (!lastToken || lastToken !== requestedRefreshToken)
      throw new UnauthorizedException('Invalid Token');

    return this.getTokens(decodedData.id);
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

    await this.redisService.updateRefreshTokenInRedis(id, refreshToken);

    return {
      refreshToken,
      accessToken,
    };
  }

  async revokeToken(id: string) {
    return this.redisService.del(id);
  }
}
