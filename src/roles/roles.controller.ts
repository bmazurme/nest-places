import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/decorators/role.enum';

import { JwtGuard } from '../oauth/jwt.guard';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({
    summary: 'Create role',
  })
  @Post()
  @Roles([Role.Admin])
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles([Role.Admin])
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({
    summary: 'Get role by ID',
  })
  @Get(':id')
  @Roles([Role.Admin])
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @Roles([Role.Admin])
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({
    summary: 'Delete role by ID',
  })
  @Delete(':id')
  @Roles([Role.Admin])
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
