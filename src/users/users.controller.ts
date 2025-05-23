import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  // SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtGuard } from '../oauth/jwt.guard';

import { User } from './entities/user.entity';
// import { GROUP_USER } from '../base-entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @SerializeOptions({
  //   groups: [GROUP_USER],
  // })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  findOne(@Req() req: { user: User }): Promise<User> {
    return this.usersService.findOne(+req.user.id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email.toString());
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles([Role.Admin])
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
