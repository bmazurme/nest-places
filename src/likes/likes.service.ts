import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/like.entity';

import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async like(createLikeDto: CreateLikeDto) {
    const like = await this.likeRepository.findOne({
      where: { user: createLikeDto.user, card: createLikeDto.card },
    });

    if (like) {
      throw new BadRequestException('found');
    }

    const { id } = await this.likeRepository.save(createLikeDto);

    return { id };
  }

  async dislike(createLikeDto: CreateLikeDto) {
    const like = await this.likeRepository.findOne({
      where: { ...createLikeDto },
      select: { id: true },
    });

    if (!like) {
      throw new NotFoundException('not found');
    }

    await this.likeRepository.delete(like.id);

    return 'success';
  }
}
