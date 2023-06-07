import { Cache, CachingConfig } from 'cache-manager';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private redisService: Cache,
  ) {}

  async get(key: string) {
    return await this.redisService.get(key);
  }

  async set(key: string, value: any, options?: CachingConfig) {
    return await this.redisService.set(key, value, options);
  }

  async del(key: string) {
    return await this.redisService.del(key);
  }
}
