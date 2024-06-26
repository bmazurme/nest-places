import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  create(createLikeDto: CreateLikeDto) {
    return this.likeRepository.save(createLikeDto);
  }

  remove(id: number) {
    return this.likeRepository.save({ id });
  }
}
