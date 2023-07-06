import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [RedisModule, AppConfigModule, MailModule],
  controllers: [OtpController],
  providers: [OtpService, RedisService, AppConfigService],
})
export class OtpModule {}
