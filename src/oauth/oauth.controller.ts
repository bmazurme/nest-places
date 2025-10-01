import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { OAuthService } from './oauth.service';

import { User } from '../users/entities/user.entity';

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
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return this.oauthService.signinOrSignup(req.user.user, response);
  }
}
