import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  getJWTSecretKey(): string {
    return this.configService.get<string>('jwt.secret_key');
  }

  getJWTAccessExpiresIn(): string {
    return this.configService.get<string>('jwt.access_expire_in');
  }

  getJWTRefreshExpiresIn(): string {
    return this.configService.get<string>('jwt.refresh_expire_in');
  }

  getFacebookClientId(): string {
    return this.configService.get<string>('facebook.client_id');
  }

  getFacebookClientSecret(): string {
    return this.configService.get<string>('facebook.client_secret');
  }

  getFacebookCallbackUrl(): string {
    return this.configService.get<string>('facebook.callback_url');
  }

  getFacebookGraphUrl(): string {
    return this.configService.get<string>('facebook.graph_url');
  }

  getFacebookAccessExpiresIn(): string {
    return this.configService.get<string>('facebook.access_expire_in');
  }

  getClientHostUrl(): string {
    return this.configService.get<string>('client_host');
  }
}
