import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  getDBUser(): string {
    return this.configService.get<string>('database.db_user');
  }

  getDBPassword(): string {
    return this.configService.get<string>('database.db_password');
  }

  getDBName(): string {
    return this.configService.get<string>('database.db_name');
  }

  getDBHost(): string {
    return this.configService.get<string>('database.db_host');
  }

  getDBPort(): number {
    return this.configService.get<number>('database.db_post');
  }

  getDBDialect(): string {
    return this.configService.get<string>('database.db_dialect');
  }
}
