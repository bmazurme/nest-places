import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { Card } from './entities/card.entity';
import { User } from '../users/entities/user.entity';

import { LikesService } from '../likes/likes.service';
import { TagsService } from '../tags/tags.service';
import { FilesService } from '../files/files.service';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  private readonly logger = new Logger('CardsService');
  
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly likesService: LikesService,
    private readonly tagsService: TagsService,
    private readonly filesService: FilesService,
    @InjectMetric('get_cards_calls')
    public counter: Counter<string>,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    if (!createCardDto || !createCardDto.name || !createCardDto.link) {
      throw new BadRequestException('Invalid card data');
    }

    if (!user || !user.id) {
      throw new BadRequestException('Invalid user object');
    }

    try {
      const tag = await this.tagsService.findByNameOrCreate(
        createCardDto.tagName,
      );

      const card = new Card();
      card.name = createCardDto.name;
      card.link = createCardDto.link.replace('.jpg', '.webp');
      card.user = user;
      card.tags = [tag];

      try {
        await this.filesService.resizeAndCopyImage(createCardDto.link);
      } catch (fileError) {
        throw new BadRequestException('Failed to process image file');
      }

      const savedCard = await this.cardRepository.save(card);
      const cardWithUser = await this.cardRepository.createQueryBuilder('card')
        .select([
          'card.id as id',
          'card.name as name',
          'card.link as link',
          //  'tag.name as tagName', // Получаем имена тегов
          'user.id as userid',
          'user.name as username'
        ])
        .leftJoin('card.user', 'user')
        .leftJoin('card.tags', 'tag')
        .where('card.id = :id', { id: savedCard.id })
        .getRawOne();
      
      return cardWithUser;
    } catch (error) {
      this.logger.error(`Card create error ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create card');
    }
  }

  async findAll() {
    try {
      return await this.cardRepository.find({
        relations: ['tags'],
        order: {
          createdAt: 'DESC' // Сортировка по дате создания
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    
      throw new InternalServerErrorException('Failed to fetch cards');
    }
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid card ID');
    }

    if (!updateCardDto) {
      throw new BadRequestException('Invalid update data');
    }

    try {
      const existingCard = await this.cardRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!existingCard) {
        throw new NotFoundException('Card not found');
      }

      return this.cardRepository.update(+id, updateCardDto);
    } catch (error) {
      this.logger.error(`Card update error ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update card');
    }
  }

  async remove(id: number, user: User) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid card ID');
    }

    if (!user || !user.id) {
      throw new BadRequestException('Invalid user object');
    }

    try {
      const card = await this.cardRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      if (card.user.id !== user.id) {
        return new ForbiddenException('Access denied');
      }

      await this.filesService.removeFile(card.link);
      await this.cardRepository.delete(id);

      return { message: 'Card was successfully deleted', id };
    } catch (error) {
      this.logger.error(`Card delete error ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete card');
    }
  }

  async getCount(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const count = await this.cardRepository.countBy({
        user: { id },
      });

      return { count };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to get card count');
    }
  }

  async getCardsByUser(userId: number, page: number, user: User) {
    const PAGE_SIZE = 3;

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    if (!Number.isInteger(page) || page <= 0) {
      throw new BadRequestException('Invalid page number');
    }

    if (!user || !user.id) {
      throw new BadRequestException('Invalid user object');
    }

    try {
      const offset = (page - 1) * PAGE_SIZE;

      return this.cardRepository.query(
        `
          SELECT t.id, t.name, t.link, t."userId" "userid", t.count::int, t.isliked, u.name userName
          FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $2) as isliked
              FROM card c
              LEFT JOIN "like" l ON c.id = l."cardId"
              WHERE c."userId" = $1
              GROUP BY c.id) t
          LEFT JOIN "user" u ON t."userId" = "u".id
          ORDER BY t.id DESC
          OFFSET $3 ROWS
          FETCH NEXT 3 ROWS ONLY
        `,
        [userId, user.id, offset],
      );
    } catch (error) {
      if (error.code && error.code.startsWith('ER_')) {
        throw new InternalServerErrorException('Database error');
      }

      throw error;
    }
  }

  async getCardsByTag(tagName: string, page: number, user: User) {
    const PAGE_SIZE = 3;

    if (!tagName || typeof tagName !== 'string') {
      throw new BadRequestException('Invalid tag name');
    }
    
    if (!Number.isInteger(page) || page <= 0) {
      this.logger.error(`Invalid page number ${page}`);
      
      throw new BadRequestException('Invalid page number');
    }

    if (!user || !user.id) {
      throw new BadRequestException('Invalid user');
    }

    try {
      const offset = (page - 1) * PAGE_SIZE;

      return this.cardRepository.query(
        `
          SELECT rslt.id, rslt.name, rslt.link, rslt."userId" userid, rslt.count::int, rslt.liked isliked, rslt.userName, rslt.tagsname tagsname
          FROM (SELECT tt.id, tt.name, tt.link, tt."userId", tt.count::int, tt.liked, tt.userName, tt.tagid, tag.name tagsname
              FROM (SELECT t.id, t.name, t.link, t."userId", t.count::int, t.liked, u.name userName, tg."tagId" tagid
                  FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $2) as liked
                      FROM card c
                      LEFT JOIN "like" l ON c.id = l."cardId"
                      GROUP BY c.id) t
                  LEFT JOIN "user" u ON t."userId" = u.id
                  LEFT JOIN "cardTags" tg ON t.id = tg."cardId") tt
              LEFT JOIN "tag" ON tt.tagid = tag.id) rslt
          WHERE tagsname = $1
          ORDER BY rslt.id DESC
          OFFSET $3 ROWS
          FETCH NEXT 3 ROWS ONLY
        `,
        [tagName, user.id, offset],
      );
    } catch (error) {
      if (error.code && error.code.startsWith('ER_')) {
        throw new InternalServerErrorException('Database error');
      }

      throw error;
    }
  }

  async getCardsByPage(page: number = 0, currentUser: number) {
    this.counter.inc();
    const PAGE_SIZE = 3;

    try {
      const offset = (page - 1) * PAGE_SIZE;

      return this.cardRepository.query(
        `
          SELECT t.id, t.name, t.link, t."userId" "userId", t.count::int, t.isLiked, u.name userName
          FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $1) as isLiked
              FROM card c
              LEFT JOIN "like" l ON c.id = l."cardId"
              GROUP BY c.id) t
          LEFT JOIN "user" u ON t."userId" = "u".id
          ORDER BY t.id DESC
          OFFSET $2 ROWS
          FETCH NEXT 3 ROWS ONLY
        `,
        [currentUser, offset],
      );
    } catch (error) {
      if (error.code && error.code.startsWith('ER_')) {
        throw new InternalServerErrorException('Database error');
      }

      throw error;
    }
  }

  async getCardById(cardId: number, userId: number) {
    if (!Number.isInteger(cardId) || cardId <= 0) {
      throw new BadRequestException('Invalid card ID');
    }
    
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const [card] = await this.cardRepository.query(
        `
          SELECT t.id, t.name, t.link, t."userId" userId, t.count::int, t.isLiked, u.name "username"
          FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $2) as isLiked
              FROM card c
              LEFT JOIN "like" l ON c.id = l."cardId"
              WHERE c.id = $1
              GROUP BY c.id) t
          LEFT JOIN "user" u ON t."userId" = "u".id
          ORDER BY t.id DESC
        `,
        [cardId, userId],
      );

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return card;
    } catch (error) {
      if (error.code && error.code.startsWith('ER_')) {
        throw new InternalServerErrorException('Database error');
      }

      throw error;
    }
  }

  async likeCard({ id }: { id: number }, user: User) {
    if (!Number.isInteger(id) || id <= 0) {
      return new BadRequestException('Invalid card ID');
    }

    try {
      await this.likesService.like({ user, card: { id } });

      const [card] = await this.cardRepository.query(
        `
          SELECT t.id, t.name, t.link, t."userId" userId, t.count::int, t.isLiked, u.name username
          FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $2) as isLiked
              FROM card c
              LEFT JOIN "like" l ON c.id = l."cardId"
              WHERE c.id = $1
              GROUP BY c.id) t
          LEFT JOIN "user" u ON t."userId" = u.id
          ORDER BY t.id DESC
        `,
        [id, user.id],
      );

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return card;
    } catch (error) {
      this.logger.error(`Like error ${error.message}`);

      if (error.code && error.code.startsWith('ER_')) {
        throw new InternalServerErrorException('Database error');
      }

      throw error;
    }
  }

  async dislikeCard({ id }: { id: number }, user: User) {
    if (!Number.isInteger(id) || id <= 0) {
      return new BadRequestException('Invalid card ID');
    }

    try {
      await this.likesService.dislike({ user, card: { id } });

      const [card] = await this.cardRepository.query(
        `
          SELECT t.id, t.name, t.link, t."userId" userId, t.count::int, t.isLiked, u.name userName
          FROM (SELECT c.id, c.name, c.link, c."userId", COUNT(l."cardId") as count, bool_or(l."userId" = $2) as isLiked
              FROM card c
              LEFT JOIN "like" l ON c.id = l."cardId"
              WHERE c.id = $1
              GROUP BY c.id) t
          LEFT JOIN "user" u ON t."userId" = u.id
          ORDER BY t.id DESC
        `,
        [id, user.id],
      );

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return card;
    } catch (error) {
      this.logger.error(`Dislike error ${error.message}`);

      if (error.code && error.code.startsWith('ER_')) {
        throw new InternalServerErrorException('Database error');
      }

      throw error;
    }
  }
}
