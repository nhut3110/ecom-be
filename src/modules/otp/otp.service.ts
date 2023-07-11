import ms, { StringValue } from 'ms';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { OTP_PREFIX } from 'src/shared';
import { AppConfigService } from '../config/app-config.service';
import { OtpTypes, OtpValidationType } from './otp.constant';

@Injectable()
export class OtpService {
  constructor(
    private redisService: RedisService,
    private appConfigService: AppConfigService,
  ) {}

  async isValidOtpRequest(email: string, type: OtpTypes) {
    const key = OTP_PREFIX + type + ':' + email;
    const recentOtp = await this.getOtpByEmail(email, type);

    if (!recentOtp) return true;

    const leftTime = await this.redisService.ttl(key);

    const validTimeToRequest = Math.floor(
      ms(this.appConfigService.otpRefreshTime as StringValue) / 1000,
    );

    if (leftTime < validTimeToRequest) return true;

    return false;
  }

  async storeOtp(email: string, otp: string, type: OtpTypes) {
    const key = OTP_PREFIX + type + ':' + email;
    const expirationTime =
      ms(this.appConfigService.otpTTL as StringValue) + Math.floor(Date.now());

    await this.redisService.set(key, otp);
    await this.redisService.expireAt(key, Math.floor(expirationTime / 1000));
  }

  getOtpByEmail(email: string, type: OtpTypes): Promise<string> {
    const key = OTP_PREFIX + type + ':' + email;

    return this.redisService.get(key);
  }

  revokeOtp(email: string, type: OtpTypes) {
    const key = OTP_PREFIX + type + ':' + email;
    return this.redisService.del(key);
  }

  async validateAndRemoveOtp({
    email,
    otp,
    isRemoved,
    type,
  }: OtpValidationType): Promise<boolean> {
    const foundOtp = await this.getOtpByEmail(email, type);

    if (foundOtp && foundOtp === otp) {
      isRemoved && (await this.revokeOtp(email, type));
      return true;
    }

    return false;
  }

  generateOtp(): string {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const otp = randomNumber.toString().padStart(6, '0');

    return otp;
  }
}
