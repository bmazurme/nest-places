import { Test, TestingModule } from '@nestjs/testing';

import { CardTagsController } from './card-tags.controller';
import { CardTagsService } from './card-tags.service';
import { CardTag } from './entities/card-tag.entity';

import { CreateCardTagDto } from './dto/create-card-tag.dto';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';

describe('CardTagsController', () => {
  let controller: CardTagsController;
  let service: CardTagsService;

  const cardTagsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardTagsController],
      providers: [CardTagsService],
    })
      .overrideProvider(CardTagsService)
      .useValue(cardTagsServiceMock)
      .compile();

    controller = module.get<CardTagsController>(CardTagsController);
    service = module.get<CardTagsService>(CardTagsService);
  });

  it('.findAll() should call CardTagsController.findAll', () => {
    jest.spyOn(service, 'findAll');
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call CardTagsController.create', () => {
    const createTagDto = { id: 0, cardId: 1, tagId: 2 } as CreateCardTagDto;
    const cardTag = { id: 0, cardId: 1, tagId: 2 } as unknown as CardTag;

    jest.spyOn(cardTagsServiceMock, 'create').mockReturnValue(cardTag);

    const result = controller.create(createTagDto);

    expect(result).toEqual(cardTag);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(cardTag);
  });

  it('.findOne() should call CardTagsController.findOne', () => {
    const id = '0';
    const cardTag = { id: 0, cardId: 1, userId: 2 } as unknown as CardTag;

    jest.spyOn(cardTagsServiceMock, 'findOne').mockReturnValue(cardTag);

    const result = controller.findOne(id);

    expect(result).toEqual(cardTag);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call CardTagsController.update', () => {
    const id = '1';
    const updateCardDto = { id: 0, cardId: 1, tagId: 2 } as UpdateCardTagDto;
    const cardTag = { id: 0, cardId: 1, tagId: 2 } as unknown as CardTag;

    jest.spyOn(cardTagsServiceMock, 'update').mockReturnValue(cardTag);

    const result = controller.update(id, updateCardDto);

    expect(result).toEqual(cardTag);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateCardDto);
  });

  it('.remove() should call CardTagsController.remove', async () => {
    const id = '1';
    const cardTag = { id: 1, cardId: 1, tagId: 2 } as unknown as CardTag;

    jest.spyOn(cardTagsServiceMock, 'remove').mockReturnValue(cardTag);

    const result = controller.remove(id);

    expect(result).toEqual(cardTag);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
