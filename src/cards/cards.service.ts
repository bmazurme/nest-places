import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from './entities/card.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  create(createCardDto: CreateCardDto) {
    return this.cardRepository.save(createCardDto);
  }

  findAll() {
    return this.cardRepository.find();
  }

  findOne(id: number) {
    return this.cardRepository.findOneBy({ id });
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return this.cardRepository.update(+id, updateCardDto);
  }

  remove(id: number) {
    return this.cardRepository.delete(id);
  }
}
