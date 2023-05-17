import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/constants';
import { User } from '../modules/users/entities/user.entity';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    imports: [AppConfigModule],
    useFactory: async (appConfigService: AppConfigService) => {
      const sequelize = new Sequelize({
        username: appConfigService.postgresUser,
        password: appConfigService.postgresPassword,
        database: appConfigService.postgresName,
        host: appConfigService.postgresHost,
        port: appConfigService.postgresPort,
        dialect: appConfigService.postgresDialect,
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [AppConfigService],
  },
];
