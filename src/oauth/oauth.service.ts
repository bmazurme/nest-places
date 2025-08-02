import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Response } from 'express';

// import { HashService } from '../hash/hash.service';
import { UsersService } from '../users/users.service';

import { User } from '../users/entities/user.entity';

@Injectable()
export class OAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // private readonly hashService: HashService,
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

    const payload = {
      sub: currentUser.id,
      roles: (currentUser as User & { roles: string[] }).roles.map(
        ({ name }) => name,
      ),
    };

    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      maxAge: 3600000,
    });

    response.send({
      access_token: this.jwtService.sign(payload),
    });
  }
}
