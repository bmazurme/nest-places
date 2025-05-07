import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  UseGuards,
  SerializeOptions,
  Put,
} from '@nestjs/common';

import { CardsService } from './cards.service';
import { LikesService } from '../likes/likes.service';

import { User } from '../users/entities/user.entity';
import { GROUP_USER } from '../base-entity';

import { JwtGuard } from '../oauth/jwt.guard';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly likesService: LikesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createCardDto: CreateCardDto, @Req() req: { user: User }) {
    return this.cardsService.create(createCardDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  @SerializeOptions({
    groups: [GROUP_USER],
  })
  async findAll() {
    return await this.cardsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @UseGuards(JwtGuard)
  @Put(':id/like')
  like(@Param('id') id: string, @Req() req: { user: User }) {
    return this.likesService.like({
      card: { id: +id },
      user: { id: req.user.id } as User,
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id/like')
  dislike(@Param('id') id: string, @Req() req: { user: User }) {
    return this.likesService.dislike({ card: { id: +id }, user: req.user });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
