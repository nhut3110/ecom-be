import * as Redis from 'redis';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { RedisService } from './redis.service';
import { REDIS_TOKEN } from 'src/shared';

@Module({
  imports: [AppConfigModule],
  providers: [
    AppConfigService,
    RedisService,
    {
      provide: REDIS_TOKEN,
      useFactory: async (appConfigService: AppConfigService) => {
        const client = Redis.createClient({
          // url: appConfigService.redisUrl,
          legacyMode: true,
          password: appConfigService.redisPassword,
          socket: {
            host: appConfigService.redisHost,
            port: appConfigService.redisPort,
          },
        });
        await client.connect();
        return client;
      },
      inject: [AppConfigService],
    },
  ],
  exports: [RedisService, REDIS_TOKEN],
})
export class RedisModule {}
