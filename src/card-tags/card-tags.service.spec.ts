import { Test, TestingModule } from '@nestjs/testing';
import { CardTagsService } from './card-tags.service';
import { CardTag } from './entities/card-tag.entity';
import { UpdateCardTagDto } from './dto/update-card-tag.dto';
import { CreateCardTagDto } from './dto/create-card-tag.dto';

describe('CardTagsService', () => {
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
      providers: [CardTagsService],
    })
      .overrideProvider(CardTagsService)
      .useValue(cardTagsServiceMock)
      .compile();

    service = module.get<CardTagsService>(CardTagsService);
  });

  it('.findAll() should call CardTagsService.findAll', () => {
    jest.spyOn(service, 'findAll');
    service.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call CardTagsService.create', () => {
    const createTagDto = { id: 0, cardId: 1, tagId: 2 } as CreateCardTagDto;
    const cardTag = { id: 0, cardId: 1, tagId: 2 } as CardTag;

    jest.spyOn(cardTagsServiceMock, 'create').mockReturnValue(cardTag);

    const result = service.create(createTagDto);

    expect(result).toEqual(cardTag);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(cardTag);
  });

  it('.findOne() should call CardTagsService.findOne', () => {
    const id = '0';
    const cardTag = { id: 0, cardId: 1, userId: 2 } as CardTag;

    jest.spyOn(cardTagsServiceMock, 'findOne').mockReturnValue(cardTag);

    const result = service.findOne(+id);

    expect(result).toEqual(cardTag);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call CardTagsService.update', () => {
    const id = '1';
    const updateCardDto = { id: 0, cardId: 1, tagId: 2 } as UpdateCardTagDto;
    const cardTag = { id: 0, cardId: 1, tagId: 2 } as CardTag;

    jest.spyOn(cardTagsServiceMock, 'update').mockReturnValue(cardTag);

    const result = service.update(+id, updateCardDto);

    expect(result).toEqual(cardTag);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateCardDto);
  });

  it('.remove() should call CardTagsService.remove', async () => {
    const id = '1';
    const cardTag = { id: 1, cardId: 1, tagId: 2 } as CardTag;

    jest.spyOn(cardTagsServiceMock, 'remove').mockReturnValue(cardTag);

    const result = service.remove(+id);

    expect(result).toEqual(cardTag);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
