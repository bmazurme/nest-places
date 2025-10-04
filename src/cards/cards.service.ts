import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  // NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from './entities/card.entity';
import { User } from '../users/entities/user.entity';

import { LikesService } from '../likes/likes.service';
import { TagsService } from '../tags/tags.service';
import { FilesService } from '../files/files.service';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly likesService: LikesService,
    private readonly tagsService: TagsService,
    private readonly filesService: FilesService,
  ) {}

  async create(createCardDto: CreateCardDto, user: User) {
    const tag = await this.tagsService.findByNameOrCreate(
      createCardDto.tagName,
    );

    const card = new Card();

    card.name = createCardDto.name;
    card.link = createCardDto.link;
    card.user = user;
    card.tags = [tag];

    await this.filesService.resizeAndCopyImage(createCardDto.link);

    return this.cardRepository.save(card);
  }

  async findAll() {
    return await this.cardRepository.find({
      relations: ['tags'],
    });
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return this.cardRepository.update(+id, updateCardDto);
  }

  async remove(id: number, user: User) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (card.user.id !== user.id) {
      return new ForbiddenException();
    }

    await this.filesService.removeFile(card.link);
    await this.cardRepository.delete(id);

    return { message: 'card was deleted', id };
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
      [userId, user.id, (page - 1) * 3],
    );
  }

  async getCardsByTag(tagName: string, page: number, user: User) {
    if (Number.isNaN(page)) {
      return new BadRequestException();
    }

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
      [tagName, user.id, (page - 1) * 3],
    );
  }

  async getCardsByPage(page: number, currentUser: number) {
    if (Number.isNaN(page)) {
      return new BadRequestException();
    }

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
      [currentUser, (page - 1) * 3],
    );
  }

  async getCardById(cardId: number, userId: number) {
    if (Number.isNaN(cardId)) {
      return new BadRequestException();
    }

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
    return card;
  }

  async likeCard({ id }: { id: number }, user: User) {
    if (Number.isNaN(id)) {
      return new BadRequestException();
    }

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

    return card;
  }

  async dislikeCard({ id }: { id: number }, user: User) {
    if (Number.isNaN(id)) {
      return new BadRequestException();
    }

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

    return card;
  }
}
