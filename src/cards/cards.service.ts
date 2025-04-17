import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from './entities/card.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { User } from '../users/entities/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  create(createCardDto: CreateCardDto, owner: User) {
    return this.cardRepository.save({ ...createCardDto, user: owner });
  }

  async findAll() {
    return await this.cardRepository.find({
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOneBy({ id });

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
