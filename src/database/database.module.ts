import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';

@Module({
  imports: [AppConfigModule],
  providers: [...databaseProviders, AppConfigService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
