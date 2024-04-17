import { Test, TestingModule } from '@nestjs/testing';

import { CardLikesController } from './card-likes.controller';
import { CardLikesService } from './card-likes.service';
import { CardLike } from './entities/card-like.entity';

import { CreateCardLikeDto } from './dto/create-card-like.dto';
import { UpdateCardLikeDto } from './dto/update-card-like.dto';

describe('CardLikesController', () => {
  let controller: CardLikesController;
  let service: CardLikesService;

  const cardLikesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardLikesController],
      providers: [CardLikesService],
    })
      .overrideProvider(CardLikesService)
      .useValue(cardLikesServiceMock)
      .compile();

    controller = module.get<CardLikesController>(CardLikesController);
    service = module.get<CardLikesService>(CardLikesService);
  });

  it('.findAll() should call CardLikesService.findAll', () => {
    jest.spyOn(service, 'findAll');
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call CardLikesService.create', () => {
    const createTagDto = { id: 0, cardId: 1, userId: 2 } as CreateCardLikeDto;
    const cardLike = { id: 0, cardId: 1, userId: 2 } as CardLike;

    jest.spyOn(cardLikesServiceMock, 'create').mockReturnValue(cardLike);

    const result = controller.create(createTagDto);

    expect(result).toEqual(cardLike);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(cardLike);
  });

  it('.findOne() should call CardLikesService.findOne', () => {
    const id = '0';
    const cardLike = { id: 0, cardId: 1, userId: 2 } as CardLike;

    jest.spyOn(cardLikesServiceMock, 'findOne').mockReturnValue(cardLike);

    const result = controller.findOne(id);

    expect(result).toEqual(cardLike);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call CardLikesService.update', () => {
    const id = '1';
    const updateCardDto = { id: 0, cardId: 1, userId: 2 } as UpdateCardLikeDto;
    const cardLike = { id: 0, cardId: 1, userId: 2 } as CardLike;

    jest.spyOn(cardLikesServiceMock, 'update').mockReturnValue(cardLike);

    const result = controller.update(id, updateCardDto);

    expect(result).toEqual(cardLike);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateCardDto);
  });

  it('.remove() should call CardLikesService.remove', async () => {
    const id = '1';
    const cardLike = { id: 1, cardId: 1, userId: 2 } as CardLike;

    jest.spyOn(cardLikesServiceMock, 'remove').mockReturnValue(cardLike);

    const result = controller.remove(id);

    expect(result).toEqual(cardLike);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
