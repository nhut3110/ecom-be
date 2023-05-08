import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from 'src/config/database/database-config.module';
import { DatabaseConfigService } from 'src/config/database/database-config.service';
import { databaseProviders } from './database.providers';

@Module({
  imports: [DatabaseConfigModule],
  providers: [...databaseProviders, DatabaseConfigService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
