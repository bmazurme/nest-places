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
} from '@nestjs/common';

import { CardsService } from './cards.service';
import { User } from '../users/entities/user.entity';
import { GROUP_USER } from '../base-entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { JwtGuard } from '../oauth/jwt.guard';

@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createCardDto: CreateCardDto, @Req() req: { user: User }) {
    return this.cardsService.create(createCardDto, req.user);
  }

  @Get()
  @SerializeOptions({
    groups: [GROUP_USER],
  })
  async findAll() {
    return await this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
