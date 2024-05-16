import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
  }

  get client(): number {
    return this.configService.get<number>('client');
  }

  get salt(): number {
    return this.configService.get<number>('salt');
  }

  get jwtSecretKey(): string {
    return this.configService.get<string>('jwt.secret-key');
  }

  get jwtAccessExpiresIn(): string {
    return this.configService.get<string>('jwt.access-token-expire-in');
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('jwt.refresh-token-expire-in');
  }

  get facebookClientId(): string {
    return this.configService.get<string>('facebook.client-id');
  }

  get facebookClientSecret(): string {
    return this.configService.get<string>('facebook.client-secret');
  }

  get facebookGraphUrl(): string {
    return this.configService.get<string>('facebook.graph-url');
  }

  get clientHostUrl(): string {
    return this.configService.get<string>('client');
  }

  get postgresUser(): string {
    return this.configService.get<string>('postgres.username');
  }

  get postgresPassword(): string {
    return this.configService.get<string>('postgres.password');
  }

  get postgresName(): string {
    return this.configService.get<string>('postgres.name');
  }

  get postgresHost(): string {
    return this.configService.get<string>('postgres.host');
  }

  get postgresPort(): number {
    return this.configService.get<number>('postgres.port');
  }

  get postgresDialect(): any {
    return this.configService.get<string>('postgres.dialect');
  }

  get cloudinaryCloudName(): string {
    return this.configService.get<string>('cloudinary.cloud-name');
  }

  get cloudinaryApiKey(): string {
    return this.configService.get<string>('cloudinary.api-key');
  }

  get cloudinaryApiSecret(): string {
    return this.configService.get<string>('cloudinary.api-secret');
  }

  get redisPort(): number {
    return this.configService.get<number>('redis.port');
  }

  get redisHost(): string {
    return this.configService.get<string>('redis.host');
  }

  get redisPassword(): string {
    return this.configService.get<string>('redis.password');
  }

  get redisUrl(): string {
    return this.configService.get<string>('redis.url');
  }

  get googleClientId(): string {
    return this.configService.get<string>('google.client-id');
  }

  get googleClientSecret(): string {
    return this.configService.get<string>('google.client-secret');
  }

  get googleToken(): string {
    return this.configService.get<string>('google.token');
  }

  get googleOauth2CallbackUrl(): string {
    return this.configService.get<string>('google.oauth2-callback-url');
  }

  get googleLoginCallbackUrl(): string {
    return this.configService.get<string>('google.login-callback-url');
  }

  get otpTTL(): string {
    return this.configService.get<string>('otp.ttl');
  }

  get otpRefreshTime(): string {
    return this.configService.get<string>('otp.refresh-otp-time');
  }

  get vnpayTmnCode(): string {
    return this.configService.get<string>('vnpay.vnp_TmnCode');
  }

  get vnpayHashSecret(): string {
    return this.configService.get<string>('vnpay.vnp_HashSecret');
  }

  get vnpayUrl(): string {
    return this.configService.get<string>('vnpay.vnp_Url');
  }

  get vnpayReturnUrl(): string {
    return this.configService.get<string>('vnpay.vnp_ReturnUrl');
  }

  get shippingPointRatio(): number {
    return this.configService.get<number>('shipping-point-ratio');
  }
}
