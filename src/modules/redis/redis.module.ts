import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule } from '@nestjs/common';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { RedisService } from './redis.service';
import * as Redis from 'redis';

@Module({
  imports: [
    AppConfigModule,
    CacheModule.registerAsync({
      extraProviders: [],
      isGlobal: true,
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        store: redisStore,
        host: appConfigService.redisHost,
        port: appConfigService.redisPort,
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [
    AppConfigService,
    RedisService,
    {
      provide: 'REDIS',
      useFactory: async () => {
        const client = Redis.createClient({
          url: 'redis://127.0.0.1:6379',
          legacyMode: true,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService, 'REDIS'],
})
export class RedisModule {}
