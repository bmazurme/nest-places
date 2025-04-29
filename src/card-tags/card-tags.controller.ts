import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CardTagsService } from './card-tags.service';

import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';
import { JwtGuard } from '../oauth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('card-tags')
export class CardTagsController {
  constructor(private readonly cardTagsService: CardTagsService) {}

  @Post()
  create(@Body() createCardTagDto: CreateCardTagDto) {
    return this.cardTagsService.create(createCardTagDto);
  }

  @Get()
  findAll() {
    return this.cardTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardTagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardTagDto: UpdateCardTagDto) {
    return this.cardTagsService.update(+id, updateCardTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardTagsService.remove(+id);
  }
}
