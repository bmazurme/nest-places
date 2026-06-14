import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CheckAuthResponseDto } from './dto/check-auth.response.dto';
import { AuthRequest } from './types/auth-request.type';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  getTargetUrl() {
    return this.configService.get<string>('TARGET_URL');
  }

  private getAccessTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    };
  }

  private getRefreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    };
  }

  private buildPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      roles: (user as User & { roles: { name: string }[] }).roles.map(
        ({ name }) => name,
      ),
    };
  }

  private generateTokens(user: User) {
    const payload = this.buildPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  async signin(currentUser: User, response: Response) {
    try {
      const { accessToken, refreshToken } = this.generateTokens(currentUser);

      await this.usersService.saveRefreshToken(currentUser.id, refreshToken);

      response.cookie(
        'access_token',
        accessToken,
        this.getAccessTokenCookieOptions(),
      );
      response.cookie(
        'refresh_token',
        refreshToken,
        this.getRefreshTokenCookieOptions(),
      );

      response.redirect(this.getTargetUrl());

      this.logger.log(`User ${currentUser.id} successfully signed in`);
    } catch (error) {
      this.logger.error('Failed to sign in', error);

      throw new HttpException(
        'Failed to sign in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(request: AuthRequest, response: Response) {
    try {
      const refreshToken = request.cookies?.refresh_token;

      if (refreshToken) {
        const user = await this.usersService.findByRefreshToken(refreshToken);

        if (user) {
          await this.usersService.saveRefreshToken(user.id, null);
        }
      }

      response.clearCookie('access_token', this.getAccessTokenCookieOptions());
      response.clearCookie(
        'refresh_token',
        this.getRefreshTokenCookieOptions(),
      );

      this.logger.log('User successfully logged out');

      return { message: 'Successfully logged out' };
    } catch (error) {
      this.logger.error('Failed to logout', error);

      throw new HttpException(
        'Failed to logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkAuth(
    request: AuthRequest,
    response: Response,
  ): Promise<CheckAuthResponseDto> {
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      return { isAuthenticated: false };
    }

    const user = await this.usersService.findByRefreshToken(refreshToken);

    if (!user) {
      return { isAuthenticated: false };
    }

    const { accessToken } = this.generateTokens(user);

    response.cookie(
      'access_token',
      accessToken,
      this.getAccessTokenCookieOptions(),
    );

    return { isAuthenticated: true, accessToken };
  }

  async refreshTokens(request: AuthRequest, response: Response) {
    const refreshToken = request.cookies?.refresh_token;

    const user = await this.usersService.findByRefreshToken(
      refreshToken as string,
    );

    if (!user) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      this.generateTokens(user);

    await this.usersService.saveRefreshToken(user.id, newRefreshToken);

    response.cookie(
      'access_token',
      accessToken,
      this.getAccessTokenCookieOptions(),
    );
    response.cookie(
      'refresh_token',
      newRefreshToken,
      this.getRefreshTokenCookieOptions(),
    );

    return { accessToken };
  }
}
