import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecretKey,
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, AppConfigService],
  exports: [AuthService],
})
export class AuthModule {}
