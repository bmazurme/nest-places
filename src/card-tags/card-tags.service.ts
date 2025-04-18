import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CardTag } from './entities/card-tag.entity';

import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';

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

  async findOne(id: number) {
    const cardTag = await this.cardTagRepository.findBy({ id });

    if (cardTag) {
      throw new BadRequestException(`card tag with id ${id} exist`);
    }

    return cardTag;
  }

  update(id: number, updateCardTagDto: UpdateCardTagDto) {
    return this.cardTagRepository.update(+id, updateCardTagDto);
  }

  remove(id: number) {
    return this.cardTagRepository.delete(id);
  }
}
