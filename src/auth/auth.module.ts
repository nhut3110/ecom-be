import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/models/users/users.module';
import { JwtStrategy } from '../middleware/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: process.env.SECRET_JWT_KEY }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
