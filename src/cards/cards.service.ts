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

  create(createCardDto: CreateCardDto, owner: User) {
    return this.cardRepository.save({ ...createCardDto, user: owner });
  }

  async findAll() {
    return await this.cardRepository.find({
      relations: {
        user: true,
        like: true,
        tags: true,
      },
      select: {
        user: {
          id: true,
          name: true,
        },
        tags: {
          name: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: {
        user: true,
        like: true,
        tags: true,
      },
      select: {
        user: {
          id: true,
          name: true,
        },
        tags: {
          name: true,
        },
      },
    });

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

  // @Post('upload')
  upload(file: Express.Multer.File) {
    console.log(file);
    return null;
  }
}
