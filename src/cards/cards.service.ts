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
    return await this.cardRepository.find({
      relations: {
        user: true,
        likes: {
          user: true,
        },
        cardTags: {
          tag: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
        },
        cardTags: {
          tagId: true,
          tag: {
            name: true,
          },
        },
        likes: {
          id: true,
          user: {
            id: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: {
        user: true,
        likes: true,
        cardTags: {
          tag: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
        },
        // cardTags: {
        //   tagId: true,
        //   // tag: {
        //   //   name: true,
        //   // },
        // },
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

  upload(file: Express.Multer.File) {
    console.log(file);
    return null;
  }
}
