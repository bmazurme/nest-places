import {
  Injectable,
  NotFoundException,
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
    const { email } = createUserDto;
    const existUsers = await this.findByEmail(email);

    if (existUsers) {
      throw new BadRequestException(`user with email ${email} exist`);
    }

    return await this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find({});
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    // if (!user) {
    //   throw new NotFoundException(`user with email ${email} not found`);
    // }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(+id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
