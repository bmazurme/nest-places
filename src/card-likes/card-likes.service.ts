import { Injectable } from '@nestjs/common';
import { CreateCardLikeDto } from './dto/create-card-like.dto';
import { UpdateCardLikeDto } from './dto/update-card-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardLike } from './entities/card-like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardLikesService {
  constructor(
    @InjectRepository(CardLike)
    private readonly cardLikeRepository: Repository<CardLike>,
  ) {}

  create(createCardLikeDto: CreateCardLikeDto) {
    return this.cardLikeRepository.save(createCardLikeDto);
  }

  findAll() {
    return this.cardLikeRepository.find();
  }

  findOne(id: number) {
    return this.cardLikeRepository.findOneBy({ id });
  }

  update(id: number, updateCardLikeDto: UpdateCardLikeDto) {
    return this.cardLikeRepository.update(+id, updateCardLikeDto);
  }

  remove(id: number) {
    return this.cardLikeRepository.remove({ id });
  }
}
