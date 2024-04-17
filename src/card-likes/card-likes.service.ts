import { Injectable } from '@nestjs/common';
import { CreateCardLikeDto } from './dto/create-card-like.dto';
import { UpdateCardLikeDto } from './dto/update-card-like.dto';

@Injectable()
export class CardLikesService {
  create(createCardLikeDto: CreateCardLikeDto) {
    return 'This action adds a new cardLike';
  }

  findAll() {
    return `This action returns all cardLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardLike`;
  }

  update(id: number, updateCardLikeDto: UpdateCardLikeDto) {
    return `This action updates a #${id} cardLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardLike`;
  }
}
