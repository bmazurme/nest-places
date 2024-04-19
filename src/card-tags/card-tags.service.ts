import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';

import { CardTag } from './entities/card-tag.entity';

@Injectable()
export class CardTagsService {
  constructor(
    @InjectRepository(CardTag)
    private readonly cardTagRepository: Repository<CardTag>,
  ) {}

  create(createCardTagDto: CreateCardTagDto) {
    return this.cardTagRepository.save(createCardTagDto);
  }

  findAll() {
    return this.cardTagRepository.find();
  }

  findOne(id: number) {
    return this.cardTagRepository.findBy({ id });
  }

  update(id: number, updateCardTagDto: UpdateCardTagDto) {
    return this.cardTagRepository.update(+id, updateCardTagDto);
  }

  remove(id: number) {
    return this.cardTagRepository.delete(id);
  }
}
