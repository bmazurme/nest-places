import {
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { RolesGuard } from '../common/guards/roles.guard';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthService } from './auth.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
