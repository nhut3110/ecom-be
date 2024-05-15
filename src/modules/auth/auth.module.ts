import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { TokensModule } from '../tokens/tokens.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { MailModule } from '../mail/mail.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    AppConfigModule,
    TokensModule,
    RedisModule,
    MailModule,
  ],
  providers: [AuthService, JwtStrategy, AppConfigService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
