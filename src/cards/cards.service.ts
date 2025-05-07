import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from './entities/card.entity';
import { User } from '../users/entities/user.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  create(createCardDto: CreateCardDto, user: User) {
    return this.cardRepository.save({ ...createCardDto, user });
  }

  async findAll() {
    const cards = await this.cardRepository
      .createQueryBuilder('card')
      .leftJoin('card.cardTags', 'cardTag')
      .leftJoin('cardTag.tag', 'tag')
      .leftJoin('card.user', 'user')
      .select([
        'card.id as id',
        'card.name as name',
        'card.link as link',
        'array_agg(tag.name) as tags',
        "json_build_object('userId', user.id, 'userName', user.name) as \"user\"",
      ])
      .groupBy('card.id')
      .addGroupBy('user.id')
      .getRawMany();

    return cards;
  }

  async findOne(id: number) {
    const card = await this.cardRepository
      .createQueryBuilder('card')
      .leftJoin('card.cardTags', 'cardTag')
      .leftJoin('cardTag.tag', 'tag')
      .leftJoin('card.user', 'user')
      .select([
        'card.id as id',
        'card.name as name',
        'card.link as link',
        'array_agg(tag.name) as tags',
        "json_build_object('userId', user.id, 'userName', user.name) as \"user\"",
      ])
      .where('card.id = :id', { id })
      .groupBy('card.id')
      .addGroupBy('user.id')
      .getRawOne();

    if (!card) {
      throw new NotFoundException(`card with id ${id} not found`);
    }

    return card;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return this.cardRepository.update(+id, updateCardDto);
  }

  remove(id: number) {
    return this.cardRepository.delete(id);
  }
}
