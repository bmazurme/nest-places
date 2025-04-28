import { NotFoundException, Injectable } from '@nestjs/common';
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

  like(createLikeDto: CreateLikeDto) {
    return this.likeRepository.save(createLikeDto);
  }

  async dislike(createLikeDto: CreateLikeDto) {
    const like = await this.likeRepository.findOne({
      where: { ...createLikeDto },
      select: { id: true },
    });

    if (!like) {
      throw new NotFoundException('not found');
    }

    return this.likeRepository.delete(like.id);
  }
}
