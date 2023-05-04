import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
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

  get facebookCallbackUrl(): string {
    return this.configService.get<string>('facebook.callback-url');
  }

  get facebookGraphUrl(): string {
    return this.configService.get<string>('facebook.graph-url');
  }

  get clientHostUrl(): string {
    return this.configService.get<string>('client');
  }
}
