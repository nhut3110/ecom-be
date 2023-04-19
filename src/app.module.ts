import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
  ],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
