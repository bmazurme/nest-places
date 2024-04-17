import { Injectable } from '@nestjs/common';
import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';

@Injectable()
export class CardTagsService {
  create(createCardTagDto: CreateCardTagDto) {
    return 'This action adds a new cardTag';
  }

  findAll() {
    return `This action returns all cardTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardTag`;
  }

  update(id: number, updateCardTagDto: UpdateCardTagDto) {
    return `This action updates a #${id} cardTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardTag`;
  }
}
