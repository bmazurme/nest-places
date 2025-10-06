import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {
  async logout(response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });
  }
}
