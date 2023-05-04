import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/models/users/users.module';
import { JwtStrategy } from '../middleware/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthConfigService } from 'src/config/auth/auth-config.service';
import { AuthConfigModule } from 'src/config/auth/auth-config.module';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AuthConfigModule],
      useFactory: async (authConfigService: AuthConfigService) => ({
        secret: await authConfigService.getJWTSecretKey(),
      }),
      inject: [AuthConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthConfigService],
  exports: [AuthService],
})
export class AuthModule {}
