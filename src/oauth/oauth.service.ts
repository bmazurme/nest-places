import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Response } from 'express';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

import { User } from '../users/entities/user.entity';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger('OauthService');
  
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signinOrSignup({ email }: User, response: Response) {
    try {
      let currentUser: User | null = await this.cacheManager.get(email);

      if (!currentUser) {
        currentUser = await this.usersService.findByEmail(email);

        if (!currentUser) {
          currentUser = await this.usersService.create({ email });
        }

        await this.cacheManager.set(email, currentUser);
      }

      this.authService.signin(currentUser, response);

      this.logger.log(`Successful user authorization/registration ${email}`);
    } catch (error) {
      this.logger.error(`Oauth error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Oauth error');
    }
  }
}
