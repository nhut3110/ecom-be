import * as Redis from 'redis';
import { Injectable, Inject } from '@nestjs/common';
import { promisify } from 'util';
import { REDIS_TOKEN } from 'src/shared';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_TOKEN)
    private readonly client: Redis.RedisClientType,
  ) {}

  // TODO: refactor and remove promisify/bind
  zAdd(key: string, score: number, member: string): Promise<number> {
    const zAddAsync = promisify(this.client.zAdd).bind(this.client);
    return zAddAsync(key, score, member);
  }

  zRange(key: string, start: number, stop: number): Promise<string[]> {
    const zRangeAsync = promisify(this.client.zRange).bind(this.client);
    return zRangeAsync(key, start, stop);
  }

  zRemRangeByScore(
    key: string,
    min: number | '-inf',
    max: number,
  ): Promise<number> {
    const zRemRangeByScoreAsync = promisify(this.client.zRemRangeByScore).bind(
      this.client,
    );
    return zRemRangeByScoreAsync(key, min, max);
  }

  zScore(key: string, member: string): Promise<number | null> {
    const zScoreAsync = promisify(this.client.zScore).bind(this.client);
    return zScoreAsync(key, member);
  }

  zRem(key: string, member: string): Promise<any> {
    const zRemAsync = promisify(this.client.zRem).bind(this.client);
    return zRemAsync(key, member);
  }

  get(key: string): Promise<string | null> {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  set(key: string, value: string): Promise<string> {
    const setAsync = promisify(this.client.set).bind(this.client);
    return setAsync(key, value);
  }

  del(key: string): Promise<number> {
    const delAsync = promisify(this.client.del).bind(this.client);
    return delAsync(key);
  }

  expireAt(key: string, timestamp: number | Date) {
    const expireAtAsync = promisify(this.client.expireAt).bind(this.client);
    return expireAtAsync(key, timestamp);
  }

  ttl(key: string) {
    const ttlAsync = promisify(this.client.ttl).bind(this.client);
    return ttlAsync(key);
  }
}
