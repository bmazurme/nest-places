import { Request } from 'express';

export interface AuthRequest extends Request {
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}
