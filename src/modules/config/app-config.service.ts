import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
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
    return this.configService.get<number>('postgres.post');
  }

  get postgresDialect(): any {
    return this.configService.get<string>('postgres.dialect');
  }

  get cloudinaryCloudName(): string {
    return this.configService.get<string>('cloudinary.cloud-name');
  }

  get cloudinaryApikey(): string {
    return this.configService.get<string>('cloudinary.api-key');
  }

  get cloudinaryApiSecret(): string {
    return this.configService.get<string>('cloudinary.api-secret');
  }
}
