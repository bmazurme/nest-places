import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './entities/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger('TagsService');

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const existingTag = await this.tagRepository.findOne({
        where: { name: createTagDto.name }
      });

      if (existingTag) {
        throw new BadRequestException('A tag with this name already exists');
      }

      this.logger.log(`Creating a new tag ${createTagDto.name}`);
          
      return this.tagRepository.save(createTagDto);
    } catch (error) {
      this.logger.error(`Create tag error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Create tag error');
    }
  }

  findAll() {
    return this.tagRepository.find({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findByNameOrCreate(name: string) {
    try {
      if (typeof name !== 'string' || name.trim() === '') {
        throw new BadRequestException('Wrong tag name');
      }

      const normalizedName = name.trim().toLowerCase();
      
      const tag = await this.tagRepository.findOne({
        where: { name: normalizedName },
        select: {
          id: true,
          name: true,
        },
      });

      if (!tag) {
        return await this.create({ name: normalizedName });
      }

      return tag;
    } catch (error) {
      this.logger.error(`Find tag by name error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Find tag by name error');
    }
  }

  async findOne(id: number) {
    try {
      if (typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid tag ID');
      }

      const tag = await this.tagRepository.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
        },
      });

      if (!tag) {
        throw new NotFoundException(`tag with id ${id} not found`);
      }

      this.logger.log(`Find tag by id error ${id}`);

      return tag;
    } catch (error) {
      this.logger.error(`Find tag by id error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Find tag by id error');
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      if (typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid tag ID');
      }

      const existingTag = await this.tagRepository.findOne({
        where: { id },
        select: { id: true, name: true }
      });

      if (!existingTag) {
        throw new BadRequestException('Tag not find');
      }

      if (updateTagDto.name) {
        const existingByName = await this.tagRepository.findOne({
          where: { name: updateTagDto.name },
          relations: ['posts']
        });

        if (existingByName && existingByName.id !== id) {
          throw new BadRequestException('Тег с таким названием уже существует');
        }
      }

      this.logger.log(`Update tag with id ${id}`);

      return this.tagRepository.update(+id, updateTagDto);
    } catch (error) {
      this.logger.error(`Update tag error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Update tag error');
    }
  }

  async remove(id: number) {
    try {
      if (typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid tag ID');
      }

      const existingTag = await this.tagRepository.findOne({
        where: { id }
      });

      if (!existingTag) {
        throw new BadRequestException('Tag not found');
      }

      this.logger.log(`Delete tag ${existingTag.name}`);

      return this.tagRepository.delete(id);
    } catch (error) {
      this.logger.error(`Delete tag error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete tag error');
    }
  }
}
