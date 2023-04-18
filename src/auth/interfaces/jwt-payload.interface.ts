export interface JwtPayload {
  // userId: string;
  username: string;
  userFullName: string;
  refreshToken?: string;
}
