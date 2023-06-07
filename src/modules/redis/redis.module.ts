import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule } from '@nestjs/common';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { RedisService } from './redis.service';

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
  providers: [AppConfigService, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
