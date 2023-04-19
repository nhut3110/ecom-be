import { Role } from 'src/common/constants/role.enum';

export interface User {
  // id: string;
  name: string;
  username: string;
  password: string;
  refreshToken: string;
  roles: Role[];
}
