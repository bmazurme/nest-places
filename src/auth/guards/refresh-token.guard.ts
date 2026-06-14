import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthRequest } from '../types/auth-request.type';
import { RefreshTokenNotFoundException } from '../exceptions/refresh-token-not-found.exception';
import { InvalidRefreshTokenException } from '../exceptions/invalid-refresh-token.exception';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      throw new RefreshTokenNotFoundException();
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
      });

      const isValid = await this.usersService.isRefreshTokenValid(
        payload.sub,
        refreshToken,
      );

      if (!isValid) {
        throw new InvalidRefreshTokenException();
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.warn('Refresh token validation failed', error);

      throw new InvalidRefreshTokenException();
    }
  }
}
