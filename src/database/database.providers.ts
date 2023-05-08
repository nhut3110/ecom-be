import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../constants';
import { User } from 'src/models/users/entities/user.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        username: 'postgres',
        password: 'postgres',
        database: 'database',
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
