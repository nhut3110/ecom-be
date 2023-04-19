import { Role } from 'src/common/constants/role.enum';

export interface JwtPayload {
  // userId: string;
  username: string;
  userFullName: string;
  refreshToken?: string;
  roles: Role[];
}
