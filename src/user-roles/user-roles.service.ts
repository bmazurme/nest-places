import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from './entities/user-role.entity';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  create(createUserRoleDto: CreateUserRoleDto) {
    return this.userRoleRepository.save(createUserRoleDto);
  }

  findAll() {
    return this.userRoleRepository.find();
  }

  async findOne(id: number) {
    const userRole = await this.userRoleRepository.findOneBy({ id });

    if (!userRole) {
      throw new NotFoundException(`user role with id ${id} not found`);
    }

    return userRole;
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return this.userRoleRepository.update(+id, updateUserRoleDto);
  }

  remove(id: number) {
    return this.userRoleRepository.delete({ id });
  }
}
