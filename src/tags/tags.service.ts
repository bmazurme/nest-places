import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './entities/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto);
  }

  findAll() {
    return this.tagRepository.find();
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOneBy({ id });

    if (!tag) {
      throw new NotFoundException(`tag with id ${id} not found`);
    }

    return tag;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagRepository.update(+id, updateTagDto);
  }

  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}
