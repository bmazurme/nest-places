import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { TARGET_URL } from '../common/configs/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async logout(response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });
  }

  async signin(currentUser: User, response: Response) {
    const payload = {
      sub: currentUser.id,
      roles: (currentUser as User & { roles: string[] }).roles.map(
        ({ name }) => name,
      ),
    };

    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      maxAge: 3600000,
    });

    response.redirect(TARGET_URL);
  }
}
