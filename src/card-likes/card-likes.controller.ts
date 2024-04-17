import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardLikesService } from './card-likes.service';
import { CreateCardLikeDto } from './dto/create-card-like.dto';
import { UpdateCardLikeDto } from './dto/update-card-like.dto';

@Controller('card-likes')
export class CardLikesController {
  constructor(private readonly cardLikesService: CardLikesService) {}

  @Post()
  create(@Body() createCardLikeDto: CreateCardLikeDto) {
    return this.cardLikesService.create(createCardLikeDto);
  }

  @Get()
  findAll() {
    return this.cardLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardLikesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardLikeDto: UpdateCardLikeDto,
  ) {
    return this.cardLikesService.update(+id, updateCardLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardLikesService.remove(+id);
  }
}
