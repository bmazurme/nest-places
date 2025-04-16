import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OAuthService } from './oauth.service';

import { User } from 'src/users/entities/user.entity';

@Controller('oauth')
@UseInterceptors(ClassSerializerInterceptor)
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get('/yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/yandex/redirect')
  @UseGuards(AuthGuard('yandex'))
  async yandexLoginRedirect(
    @Req() req: Request & { user: { user: User } },
  ): Promise<any> {
    return this.oauthService.signinOrSignup(req.user.user);
  }
}
