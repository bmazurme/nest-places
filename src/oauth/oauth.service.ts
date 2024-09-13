import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// import { HashService } from '../hash/hash.service';
import { UsersService } from '../users/users.service';

import { User } from '../users/entities/user.entity';

@Injectable()
export class OAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // private readonly hashService: HashService,
  ) {}

  async signinOrSignup({ email }: User) {
    let currentUser = await this.usersService.findByEmail(email);

    if (!currentUser) {
      currentUser = await this.usersService.create({ email });
    }

    const payload = { sub: currentUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
