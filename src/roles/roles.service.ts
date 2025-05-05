import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

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

  findAll() {
    return this.roleRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(+id, updateRoleDto);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
