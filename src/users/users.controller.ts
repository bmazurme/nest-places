import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtGuard } from '../common/guards/jwt.guard';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * User controller
 */
@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get users
   */
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Get current users
   */
  @ApiOperation({
    summary: 'Get user info',
  })
  @Get('me')
  findOne(@Req() req: { user: User }): Promise<User> {
    return this.usersService.findOne(+req.user.id);
  }

  /**
   * Get user by email
   * @param email User email
   */
  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email.toString());
  }

  /**
   * Get user by Id
   * @param id User userId
   */
  @ApiOperation({
    summary: 'Get user info by ID',
  })
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * Update a user
   * @param userId User id
   * @param userData User data
   */
  @ApiOperation({
    summary: 'Change user profile',
  })
  @Patch('me')
  update(@Body() userData: UpdateUserDto) {
    return this.usersService.update(userData);
  }

  /**
   * Delete a user
   * @param params
   */
  @ApiOperation({
    summary: 'Delete user by ID',
  })
  @Delete(':id')
  @Roles([Role.Admin])
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
