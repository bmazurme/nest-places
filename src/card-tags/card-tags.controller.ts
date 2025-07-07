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
import { JwtGuard } from '../oauth/jwt.guard';

import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';

/**
 * Controller for managing card-tag relationships.
 * Handles CRUD operations for card-tag associations.
 * Requires JWT authentication for all endpoints.
 */
@UseGuards(JwtGuard)
@Controller('card-tags')
export class CardTagsController {
  /**
   * Constructor initializing the CardTagsService dependency
   * @param cardTagsService Service for handling card-tag operations
   */
  constructor(private readonly cardTagsService: CardTagsService) {}

  /**
   * Creates a new card-tag relationship
   * @param createCardTagDto DTO containing cardId and tagId
   * @returns Created card-tag relationship
   */
  @Post()
  create(@Body() createCardTagDto: CreateCardTagDto) {
    return this.cardTagsService.create(createCardTagDto);
  }

  /**
   * Retrieves all card-tag relationships
   * @returns Array of all card-tag relationships
   */
  @Get()
  findAll() {
    return this.cardTagsService.findAll();
  }

  /**
   * Finds a specific card-tag relationship by ID
   * @param id ID of the card-tag relationship to find
   * @returns Found card-tag relationship
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardTagsService.findOne(+id);
  }

  /**
   * Updates an existing card-tag relationship
   * @param id ID of the card-tag relationship to update
   * @param updateCardTagDto DTO containing updated data
   * @returns Updated card-tag relationship
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardTagDto: UpdateCardTagDto) {
    return this.cardTagsService.update(+id, updateCardTagDto);
  }

  /**
   * Deletes a card-tag relationship by ID
   * @param id ID of the card-tag relationship to delete
   * @returns Confirmation of deletion
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardTagsService.remove(+id);
  }
}
