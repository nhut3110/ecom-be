import { User } from './entities/user.entity';
import { USER_REPOSITORY } from 'src/constants';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
