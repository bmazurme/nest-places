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
import {
  createRequestCounter,
  createRequestDurationHistogram,
} from '../metrics/metrics.provider';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private createUserCounter = createRequestCounter(
    'users_create_total',
    'Total number of created users',
  );

  private findUserHistogram = createRequestDurationHistogram(
    'users_find_duration_seconds',
    'Duration of user find operations',
  );

  private updateUserCounter = createRequestCounter(
    'users_update_total',
    'Total number of updated users',
  );

  private deleteUserCounter = createRequestCounter(
    'users_delete_total',
    'Total number of deleted users',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const end = this.findUserHistogram.startTimer({ operation: 'create' });

    try {
      const existUsers = await this.findByEmail(email);

      if (existUsers) {
        throw new BadRequestException(`user with email ${email} exist`);
      }

      const user = await this.userRepository.save(createUserDto);
      this.createUserCounter.inc({ success: 'true' });

      return user;
    } catch (error) {
      this.logger.error(error.message);
      this.createUserCounter.inc({ success: 'false' });

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('create user error');
    } finally {
      end();
    }
  }

  async findAll() {
    const end = this.findUserHistogram.startTimer({ operation: 'findAll' });

    try {
      return await this.userRepository.find({
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
    } finally {
      end();
    }
  }

  async findOne(id: number) {
    const end = this.findUserHistogram.startTimer({ operation: 'findOne' });

    try {
      if (!Number.isInteger(id) || id <= 0) {
        this.logger.warn(`Invalid user ID - ${id}`);

        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user) {
        this.logger.warn(`user with id ${id} not found`);

        throw new NotFoundException(`user with id ${id} not found`);
      }

      this.logger.log(`User ${user.id} successfully found`);

      return user;
    } catch (error) {
      this.logger.error('findOne error');

      throw error;
    } finally {
      end();
    }
  }

  async findByAvatar(fileName: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { avatar: fileName },
      });

      if (!user) {
        this.logger.warn(`user with avatar ${fileName} not found`);

        throw new NotFoundException(`user with avatar ${fileName} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`findByAvatar error - fileName: ${fileName}`);

      throw error;
    }
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
    const end = this.findUserHistogram.startTimer({ operation: 'update' });

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

      this.updateUserCounter.inc({ success: 'true' });

      return {
        ...user,
        name: updateUserDto.name,
        about: updateUserDto.about,
      };
    } catch (error) {
      this.logger.error('Update user error');
      this.updateUserCounter.inc({ success: 'false' });

      throw error;
    } finally {
      end();
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
      this.logger.warn(`Invalid user ID - with ID: ${id}`);

      throw new BadRequestException('Invalid user ID');
    }

    const end = this.findUserHistogram.startTimer({ operation: 'delete' });

    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        this.logger.warn(`User not found - with ID: ${id}`);

        throw new Error('User not found');
      }

      await this.userRepository.delete(id);

      this.logger.log(`Delete user with ID: ${id}`);
      this.deleteUserCounter.inc({ success: 'true' });

      return { deleted: true };
    } catch (error) {
      this.logger.error(`Delete user with ID: ${id}`);
      this.deleteUserCounter.inc({ success: 'false' });

      throw error;
    } finally {
      end();
    }
  }
}
