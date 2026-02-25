import {
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';

@UseGuards(JwtGuard)
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: User,
  ) {
    return this.authService.logout(response, user);
  }
}
