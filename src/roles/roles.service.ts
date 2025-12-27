import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * Service for managing roles in the system.
 * Provides methods for CRUD operations on roles.
 * Uses TypeORM repository pattern for database operations.
 */
@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  /**
   * Constructor initializing repository dependency
   * @param roleRepository Repository for performing database operations on roles
   */
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Creates a new role
   * @param createRoleDto DTO containing role creation data
   * @returns Created role entity
   * @throws BadRequestException if role with the same name already exists
   */
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });

      if (role) {
        throw new BadRequestException(
          `role with name ${createRoleDto.name} exist`,
        );
      }

      return this.roleRepository.save(createRoleDto);
    } catch (error) {
      this.logger.error('Find roles error');

      throw error;
    }
  }

  /**
   * Retrieves all roles
   * @returns Array of roles with selected fields (id and name)
   */
  findAll() {
    try {
      return this.roleRepository.find({
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      this.logger.error('Find roles error');

      throw error;
    }
  }

  /**
   * Finds a role by ID
   * @param id ID of the role to find
   * @returns Role entity with selected fields (id and name)
   * @throws NotFoundException if role with given ID does not exist
   */
  async findOne(id: number) {
    try {
      if (typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid role ID');
      }

      const role = await this.roleRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      if (!role) {
        throw new NotFoundException(`role with id ${id} not found`);
      }

      return role;
    } catch (error) {
      this.logger.error('Find role error');

      throw error;
    }
  }

  /**
   * Updates an existing role
   * @param id ID of the role to update
   * @param updateRoleDto DTO containing updated role data
   * @returns Update result
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      if (typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid role ID');
      }

      const existingRole = await this.roleRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!existingRole) {
        throw new NotFoundException('Role not found');
      }

      if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
        const roleWithSameName = await this.roleRepository.findOne({
          where: { name: updateRoleDto.name.toLowerCase() },
        });

        if (roleWithSameName) {
          throw new ConflictException('A role with this name already exists');
        }
      }

      return this.roleRepository.update(+id, updateRoleDto);
    } catch (error) {
      this.logger.error('Update role error');

      throw error;
    }
  }

  /**
   * Deletes a role by ID
   * @param id ID of the role to delete
   * @returns Deletion result
   */
  async remove(id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('Invalid role ID');
      }

      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['users'], // Проверяем связанные пользователи
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (role.users.length > 0) {
        throw new ForbiddenException(
          'The role cannot be deleted because it is associated with users'
        );
      }

      this.logger.log(`Delete role ${id}`);

      return this.roleRepository.delete(id);
    } catch (error) {
      this.logger.error('Delete role error');

      throw error;
    }
  }
}
