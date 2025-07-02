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

import { UserRolesService } from './user-roles.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/role.enum';

import { JwtGuard } from '../oauth/jwt.guard';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Controller for managing user roles in the system.
 * Handles CRUD operations for user roles.
 * Requires JWT authentication and specific role-based authorization (only Admin can perform operations).
 */
@UseGuards(JwtGuard, RolesGuard)
@Controller('user-roles')
export class UserRolesController {
  /**
   * Constructor initializing service dependencies
   * @param userRolesService Service for handling user roles operations
   */
  constructor(private readonly userRolesService: UserRolesService) {}

  /**
   * Creates a new user role assignment
   * @param createUserRoleDto DTO containing user role creation data
   * @returns Created user role assignment
   * @swagger
   * operationId: createUserRole
   * responses:
   * 201:
   * description: User role created successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/UserRole'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can create user roles)
   */
  @Post()
  @Roles([Role.Admin])
  @ApiResponse({ status: 201, description: 'User role created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  /**
   * Retrieves all user roles
   * @returns Array of user roles
   * @swagger
   * operationId: getUserRoles
   * responses:
   * 200:
   * description: User roles retrieved successfully
   * content:
   * application/json:
   * schema:
   * type: array
   * items:
   * $ref: '#/components/schemas/UserRole'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can view user roles)
   */
  @Get()
  @Roles([Role.Admin])
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.userRolesService.findAll();
  }

  /**
   * Finds a user role by ID
   * @param id User role ID
   * @returns User role object
   * @swagger
   * operationId: getUserRoleById
   * responses:
   * 200:
   * description: User role retrieved successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/UserRole'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can view user roles)
   * 404:
   * description: User role not found
   */
  @Get(':id')
  @Roles([Role.Admin])
  @ApiResponse({ status: 200, description: 'User role retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User role not found' })
  findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(+id);
  }

  /**
   * Updates an existing user role
   * @param id User role ID
   * @param updateUserRoleDto DTO containing updated user role data
   * @returns Updated user role
   * @swagger
   * operationId: updateUserRole
   * responses:
   * 200:
   * description: User role updated successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/UserRole'
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can update user roles)
   * 404:
   * description: User role not found
   */
  @Patch(':id')
  @Roles([Role.Admin])
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User role not found' })
  update(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(+id, updateUserRoleDto);
  }

  /**
   * Deletes a user role by ID
   * @param id User role ID to delete
   * @returns Deletion result
   * @swagger
   * operationId: deleteUserRole
   * responses:
   * 204:
   * description: User role deleted successfully
   * 401:
   * description: Unauthorized
   * 403:
   * description: Forbidden (only Admin can delete user roles)
   * 404:
   * description: User role not found
   */
  @Delete(':id')
  @Roles([Role.Admin])
  @ApiResponse({ status: 204, description: 'User role deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User role not found' })
  remove(@Param('id') id: string) {
    return this.userRolesService.remove(+id);
  }
}
