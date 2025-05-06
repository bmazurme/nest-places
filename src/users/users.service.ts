import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

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
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .select([
        'user.id as id',
        'user.name as name',
        'user.about as about',
        'user.email as email',
        'user.avatar as avatar',
        'array_agg(role.name) as roles',
      ])
      .groupBy('user.id')
      .getRawMany();

    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .select([
        'user.id as id',
        'user.name as name',
        'user.about as about',
        'user.email as email',
        'user.avatar as avatar',
        'array_agg(role.name) as roles',
      ])
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .getRawOne();

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userRoles', 'userRole')
      .leftJoin('userRole.role', 'role')
      .select(['user.id', 'array_agg(role.name) as roles'])
      .where('user.email = :email', { email })
      .groupBy('user.id')
      .getRawMany();

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(+id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
