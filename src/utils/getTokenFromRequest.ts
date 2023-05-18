import { Request } from 'express';

export const getTokenFromRequest = (req: Request): string => {
  return req.headers['authorization'].split(' ')[1];
};
