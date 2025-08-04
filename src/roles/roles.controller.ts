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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/decorators/role.enum';

import { JwtGuard } from '../common/guards/jwt.guard';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * Controller for managing roles in the system.
 * Handles CRUD operations for roles.
 * Requires JWT authentication and specific role-based authorization (only Admin can perform operations).
 */
@UseGuards(JwtGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  /**
   * Constructor initializing service dependencies
   * @param rolesService Service for handling role operations
   */
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Creates a new role
   * @param createRoleDto DTO containing role creation data
   * @returns Created role
   * @swagger
   * operationId: createRole
   * responses:
   * 201:
   * description: Role created successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/Role'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can create roles)
   */
  @ApiOperation({
    summary: 'Create role',
  })
  @Post()
  @Roles([Role.Admin])
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Retrieves all roles
   * @returns Array of roles
   * @swagger
   * operationId: getRoles
   * responses:
   * 200:
   * description: Roles retrieved successfully
   * content:
   * application/json:
   * schema:
   * type: array
   * items:
   * $ref: '#/components/schemas/Role'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can view roles)
   */
  @Get()
  @Roles([Role.Admin])
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Finds a role by ID
   * @param id Role ID
   * @returns Role object
   * @swagger
   * operationId: getRoleById
   * responses:
   * 200:
   * description: Role retrieved successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/Role'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can view roles)
   * 404:
   * description: Role not found
   */
  @ApiOperation({
    summary: 'Get role by ID',
  })
  @Get(':id')
  @Roles([Role.Admin])
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  /**
   * Updates an existing role
   * @param id Role ID
   * @param updateRoleDto DTO containing updated role data
   * @returns Updated role
   * @swagger
   * operationId: updateRole
   * responses:
   * 200:
   * description: Role updated successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/Role'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can update roles)
   * 404:
   * description: Role not found
   */
  @Patch(':id')
  @Roles([Role.Admin])
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  /**
   * Deletes a role by its ID
   * @param id Role ID to delete
   * @returns Deletion result
   * @swagger
   * operationId: deleteRoleById
   * responses:
   * 204:
   * description: Role deleted successfully
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only admin can delete roles)
   * 404:
   * description: Role not found
   * security:
   * - bearerAuth: []
   * tags:
   * - Roles
   * summary: Delete role by ID
   * description: Deletes a role by its unique identifier. Only admin users can perform this action.
   */
  @ApiOperation({
    summary: 'Delete role by ID',
  })
  @Delete(':id')
  @Roles([Role.Admin])
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (only admin can delete roles)',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
