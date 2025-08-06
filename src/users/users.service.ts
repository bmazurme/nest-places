import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
// import { Role } from '../roles/entities/role.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existUsers = await this.findByEmail(email);

    if (existUsers) {
      throw new BadRequestException(`user with email ${email} exist`);
    }

    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find({
      // relations: ['roles'],
      select: {
        id: true,
        name: true,
        about: true,
        avatar: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    return user;
  }
  async findByAvatar(fileName: string) {
    const user = await this.userRepository.findOne({
      where: { avatar: fileName },
    });

    if (!user) {
      throw new NotFoundException(`user with avatar ${fileName} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto.id, {
      name: updateUserDto.name,
      about: updateUserDto.about,
    });
    // const user = await this.userRepository.findOne({
    //   where: { id },
    //   relations: ['roles'],
    // });

    // if (user?.roles) {
    //   const role = new Role();
    //   role.id = updateUserDto.role.id;
    //   role.name = updateUserDto.role.name;

    //   await user.updateRoles([role], this.userRepository.manager);
    // }

    // return user;
  }

  async updateAvatar(updateUserDto: { id: number; avatar: string }) {
    return this.userRepository.update(updateUserDto.id, {
      avatar: updateUserDto.avatar,
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
