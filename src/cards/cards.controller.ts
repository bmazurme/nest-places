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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CardsService } from './cards.service';
import { LikesService } from '../likes/likes.service';

import { User } from '../users/entities/user.entity';
import { GROUP_USER } from '../base-entity';

import { JwtGuard } from '../oauth/jwt.guard';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

/**
 * Controller for managing card operations.
 * Handles CRUD operations for cards and related actions like liking/disliking.
 * Requires JWT authentication for all endpoints.
 * Uses ClassSerializerInterceptor for response serialization.
 */
@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardsController {
  /**
   * Constructor initializing service dependencies
   * @param cardsService Service for handling card operations
   * @param likesService Service for handling card likes
   */
  constructor(
    private readonly cardsService: CardsService,
    private readonly likesService: LikesService,
  ) {}

  /**
   * Creates a new card
   * @param createCardDto DTO containing card creation data
   * @param req Request object containing authenticated user
   * @returns Created card
   */
  @ApiOperation({
    summary: 'Create card',
  })
  @UseGuards(JwtGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCardDto: CreateCardDto, @Req() req: { user: User }) {
    return this.cardsService.create(createCardDto, req.user);
  }

  /**
   * Retrieves all cards
   * @returns Array of cards
   */
  @ApiOperation({
    summary: 'Get cards',
  })
  @UseGuards(JwtGuard)
  @Get()
  @SerializeOptions({
    groups: [GROUP_USER],
  })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return await this.cardsService.findAll();
  }

  /**
   * Finds a card by ID
   * @param id ID of the card to find
   * @returns Found card
   */
  @ApiOperation({
    summary: 'Get card by ID',
  })
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Card retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  /**
   * Updates an existing card
   * @param id ID of the card to update
   * @param updateCardDto DTO containing updated card data
   * @returns Updated card
   */
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  /**
   * Adds a like to a card
   * @param id ID of the card to like
   * @param req Request object containing authenticated user
   * @returns Like operation result
   */
  @UseGuards(JwtGuard)
  @Put(':id/like')
  like(@Param('id') id: string, @Req() req: { user: User }) {
    return this.likesService.like({
      card: { id: +id },
      user: { id: req.user.id } as User,
    });
  }

  /**
   * Removes a like from a card
   * @param id ID of the card to dislike
   * @param req Request object containing authenticated user
   * @returns Dislike operation result
   */
  @UseGuards(JwtGuard)
  @Delete(':id/like')
  dislike(@Param('id') id: string, @Req() req: { user: User }) {
    return this.likesService.dislike({ card: { id: +id }, user: req.user });
  }

  /**
   * Deletes a card by ID
   * @param id ID of the card to delete
   * @returns Deletion result
   */
  @ApiOperation({
    summary: 'Delete card by ID',
  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}
