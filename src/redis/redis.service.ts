import { Cache } from 'cache-manager';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { convertTimeToSeconds } from 'src/utils/convertTimeToSeconds';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private redisService: Cache,
    private appConfigService: AppConfigService,
  ) {}

  async get(key: string) {
    return await this.redisService.get(key);
  }

  async set(key: string, value: any) {
    return await this.redisService.set(key, value);
  }

  async del(key: string) {
    return await this.redisService.del(key);
  }

  async updateRefreshTokenInRedis(id: string, refreshToken: string) {
    await this.redisService.del(id);
    const ttl = convertTimeToSeconds(this.appConfigService.jwtRefreshExpiresIn);
    return await this.redisService.set(id, refreshToken, {
      ttl: ttl,
    });
  }
}
