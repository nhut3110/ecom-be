import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/config/app-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UsersModule, AuthModule, AppConfigModule, DatabaseModule],
})
export class AppModule {}
