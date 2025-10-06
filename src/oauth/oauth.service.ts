import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Response } from 'express';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

import { User } from '../users/entities/user.entity';


@Injectable()
export class OAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signinOrSignup({ email }: User, response: Response) {
    let currentUser: User | null = await this.cacheManager.get(email);

    if (!currentUser) {
      currentUser = await this.usersService.findByEmail(email);

      if (!currentUser) {
        currentUser = await this.usersService.create({ email });
      }

      await this.cacheManager.set(email, currentUser);
    }

    this.authService.signin(currentUser, response);
  }
}
