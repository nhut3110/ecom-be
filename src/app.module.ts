import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/config/app-config.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/entities/user.entity';
import { AppConfigService } from './modules/config/app-config.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AppConfigModule,
    // DatabaseModule,
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => {
        return {
          username: appConfigService.postgresUser,
          password: appConfigService.postgresPassword,
          database: appConfigService.postgresName,
          host: appConfigService.postgresHost,
          port: appConfigService.postgresPort,
          dialect: appConfigService.postgresDialect,
          autoLoadModels: true,
          synchronize: true,
          models: [User],
        };
      },
      inject: [AppConfigService],
    }),
  ],
})
export class AppModule {}
