import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '../config/app-config.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../config/app-config.service';
import { JwtStrategy } from 'src/middleware/strategies/jwt.strategy';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    AppConfigModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecretKey,
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [JwtStrategy, AppConfigService, TokensService, RedisService],
  exports: [TokensService],
})
export class TokensModule {}
