import { Cache, CachingConfig } from 'cache-manager';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { promisify } from 'util';

@Injectable()
export class RedisService {
  private zRangeAsync: (
    key: string,
    start: number,
    stop: number,
  ) => Promise<string[]>;
  private zAddAsync: (
    key: string,
    score: number,
    member: string,
  ) => Promise<number>;
  private zRemRangeByScoreAsync: (
    key: string,
    min: number | '-inf',
    max: number,
  ) => Promise<number>;
  private zScoreAsync: (key: string, member: string) => Promise<number | null>;
  private zRemAsync: (key: string, member: string) => Promise<any>;

  constructor(
    @Inject(CACHE_MANAGER)
    private redisService: Cache,
    @Inject('REDIS')
    private readonly client,
  ) {
    this.zRangeAsync = promisify(this.client.zRange).bind(this.client);
    this.zAddAsync = promisify(this.client.zAdd).bind(this.client);
    this.zRemRangeByScoreAsync = promisify(this.client.zRemRangeByScore).bind(
      this.client,
    );
    this.zScoreAsync = promisify(this.client.zScore).bind(this.client);
    this.zRemAsync = promisify(this.client.zRem).bind(this.client);
  }

  async get(key: string) {
    return await this.redisService.get(key);
  }

  async set(key: string, value: any, options?: CachingConfig) {
    return await this.redisService.set(key, value, options);
  }

  async del(key: string) {
    return await this.redisService.del(key);
  }

  async zAdd(key: string, score: number, member: string): Promise<number> {
    return await this.zAddAsync(key, score, member);
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.zRangeAsync(key, start, stop);
  }

  async zRemRangeByScore(
    key: string,
    min: number | '-inf',
    max: number,
  ): Promise<number> {
    return await this.zRemRangeByScoreAsync(key, min, max);
  }

  async zScore(key: string, member: string): Promise<number | null> {
    return await this.zScoreAsync(key, member);
  }

  async zRem(key: string, member: string): Promise<any> {
    return await this.zRemAsync(key, member);
  }
}
