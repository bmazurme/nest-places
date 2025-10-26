import {
  NotFoundException,
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/like.entity';

import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  private readonly logger = new Logger('UserService');
  
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async like(createLikeDto: CreateLikeDto) {
    try {
      const like = await this.likeRepository.findOne({
        where: {
          card: createLikeDto.card,
          user: { id: createLikeDto.user.id },
        },
      });

      if (like) {
        throw new BadRequestException('found');
      }

      this.logger.log(`Adding a like to the card ${createLikeDto.card.id} by user ${createLikeDto.user.id}`);

      const { id } = await this.likeRepository.save(createLikeDto);

      return { id };
    } catch (error) {
      this.logger.error(`like error: ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('like error');
    }
  }

  async dislike(createLikeDto: CreateLikeDto) {
    try {
      console.log(createLikeDto);

      const like = await this.likeRepository.findOne({
        where: {
          card: createLikeDto.card,
          user: createLikeDto.user,
        },
        select: { id: true },
      });

      if (!like) {
        throw new NotFoundException('like not found');
      }

      this.logger.log(`Removing a like for the card ${createLikeDto.card.id} by user ${createLikeDto.user.id}`);

      return await this.likeRepository.delete(like.id);
    } catch (error) {
      this.logger.error(`delete like error: ${error.message}`);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('delete like error');
    }
  }
}
