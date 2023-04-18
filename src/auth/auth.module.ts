import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/models/users/users.module';
import { JwtAccessTokenStrategy } from './jwt-accessToken.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtRefreshTokenStrategy } from './jwt-refreshToken.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({
      signOptions: {},
    }),
  ],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
