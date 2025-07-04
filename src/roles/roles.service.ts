import {
  BadRequestException,
  Injectable,
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
    const role = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (role) {
      throw new BadRequestException(
        `role with name ${createRoleDto.name} exist`,
      );
    }

    return this.roleRepository.save(createRoleDto);
  }

  /**
   * Retrieves all roles
   * @returns Array of roles with selected fields (id and name)
   */
  findAll() {
    return this.roleRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
  }

  /**
   * Finds a role by ID
   * @param id ID of the role to find
   * @returns Role entity with selected fields (id and name)
   * @throws NotFoundException if role with given ID does not exist
   */
  async findOne(id: number) {
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
  }

  /**
   * Updates an existing role
   * @param id ID of the role to update
   * @param updateRoleDto DTO containing updated role data
   * @returns Update result
   */
  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(+id, updateRoleDto);
  }

  /**
   * Deletes a role by ID
   * @param id ID of the role to delete
   * @returns Deletion result
   */
  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
