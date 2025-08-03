import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from './entities/card.entity';
import { User } from '../users/entities/user.entity';

// import { CardDto } from './dto/card.dto';
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
      relations: ['tags'],
    });
  }

  async findOne(id: number) {
    const card = await this.cardRepository.find({
      where: { id },
      relations: ['tags'],
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

  async getCount(id: number) {
    const count = await this.cardRepository.countBy({
      user: { id },
    });

    return { count };
  }

  async getCardsByUser(userId: number, page: number, user: User) {
    if (Number.isNaN(userId) || Number.isNaN(page)) {
      return new BadRequestException();
    }

    return this.cardRepository.query(
      `
        SELECT t.id, t.name, t.link, t."userId" "userId", t.count::int, t."isLiked", u.name userName
        FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $2) as "isLiked"
            FROM card c
            LEFT JOIN "like" l ON c.id = l."cardId"
            WHERE c."userId" = $1
            GROUP BY c.id) t
        LEFT JOIN "user" u ON t."userId" = "u".id
        ORDER BY t.id DESC
        OFFSET $3 ROWS
        FETCH NEXT 3 ROWS ONLY
      `,
      [userId, user.id, page - 1],
    );
  }
}
