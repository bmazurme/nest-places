import {
  Injectable,
  // NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUsers = await this.findByEmail(createUserDto.email);

    if (existUsers) {
      throw new BadRequestException(
        'Пользователь с указанным email или username уже существует',
      );
    }

    return await this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find({});
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(+id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
