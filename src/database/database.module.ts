import { Module } from '@nestjs/common';
import { AppConfigModule } from '../modules/config/app-config.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../modules/users/entities/user.entity';
import { AppConfigService } from '../modules/config/app-config.service';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Module({
  imports: [
    AppConfigModule,
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
          models: [User, Category, Product],
        };
      },
      inject: [AppConfigService],
    }),
  ],
})
export class DatabaseModule {}
