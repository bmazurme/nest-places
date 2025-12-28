import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  getTargetUrl() {
    return this.configService.get<string>('TARGET_URL');
  }

  async logout(response: Response, user: User) {
    try {
      response.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', // sameSite: 'strict',
        maxAge: 0,
        domain: '.ntlstl.dev',
      });

      this.logger.log(`User ${user.id} successfully logged out`);
    } catch (error) {
      this.logger.error('Failed to logout', error);

      throw new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signin(currentUser: User, response: Response) {
    try {
      const payload = {
        sub: currentUser.id,
        roles: (currentUser as User & { roles: string[] }).roles.map(
          ({ name }) => name,
        ),
      };

      response.cookie('access_token', this.jwtService.sign(payload), {
        httpOnly: true,
        maxAge: 3600000,
        secure: true,  // Только для HTTPS
        sameSite: 'none', // Для междоменных запросов
        domain: '.ntlstl.dev',  // Общий домен для всех поддоменов
      });

      response.redirect(this.getTargetUrl());

      this.logger.log(`User ${currentUser.id} successfully signed in`);
    } catch (error) {
      this.logger.error('Failed to sign in', error);

      throw new HttpException('Failed to sign in', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
