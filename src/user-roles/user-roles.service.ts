import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

import { UserRole } from './entities/user-role.entity';

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

  findOne(id: number) {
    return this.userRoleRepository.findOneBy({ id });
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return this.userRoleRepository.update(+id, updateUserRoleDto);
  }

  remove(id: number) {
    return this.userRoleRepository.delete({ id });
  }
}
