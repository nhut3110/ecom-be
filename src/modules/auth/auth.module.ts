import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { TokensModule } from '../tokens/tokens.module';
import { TokensService } from '../tokens/tokens.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    AppConfigModule,
    TokensModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecretKey,
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AppConfigService,
    TokensService,
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
