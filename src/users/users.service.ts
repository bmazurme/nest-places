import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    
    try {
      const existUsers = await this.findByEmail(email);

      if (existUsers) {
        throw new BadRequestException(`user with email ${email} exist`);
      }

      return await this.userRepository.save(createUserDto);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('create user error');
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find({
        // relations: ['roles'],
        select: {
          id: true,
          name: true,
          about: true,
          avatar: true,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException(`user with id ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error('Update user error');
      throw error;
    }
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
    try {
      const user = await this.userRepository.findOne({
        where: { id: updateUserDto.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      this.logger.log(`Update user ${updateUserDto.id}`);

      await this.userRepository.update(updateUserDto.id, {
        name: updateUserDto.name,
        about: updateUserDto.about,
      });

      return { ...user,
        name: updateUserDto.name,
        about: updateUserDto.about,
      };
    } catch (error) {
      this.logger.error('Update user error');
      throw error;
    }
  }

  async updateAvatar(updateUserDto: { id: number; avatar: string }) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: updateUserDto.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      this.logger.log(`Update user avatar ${updateUserDto.id}`);

      return this.userRepository.update(updateUserDto.id, {
        avatar: updateUserDto.avatar,
      });
    } catch (error) {
      this.logger.error('Update avatar error');
      throw error;
    }
  }

  async remove(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      this.logger.log(`Удаление пользователя с ID: ${id}`);
      
      return this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(`Delete user with ID: ${id}`);
      throw error;
    }
  }
}
