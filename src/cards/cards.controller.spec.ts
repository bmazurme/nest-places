import { Test, TestingModule } from '@nestjs/testing';

import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

describe('CardsController', () => {
  let controller: CardsController;
  let service: CardsService;

  const cardsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService],
    })
      .overrideProvider(CardsService)
      .useValue(cardsServiceMock)
      .compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService);
  });

  it('.findAll() should call CardsService.findAll', () => {
    jest.spyOn(service, 'findAll');
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call CardsService.create', () => {
    const createTagDto = { name: 'Name', link: '', userId: 0 } as CreateCardDto;
    const card = {
      id: 0,
      name: 'Name',
      link: '',
      userId: 0,
    } as Card;

    jest.spyOn(cardsServiceMock, 'create').mockReturnValue(card);

    const result = controller.create(createTagDto);

    expect(result).toEqual(card);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({
      name: 'Name',
      link: '',
      userId: 0,
    });
  });

  it('.findOne() should call CardsService.findOne', () => {
    const id = '0';
    const card = {
      id: 0,
      name: 'Name',
      link: '',
      userId: 0,
    } as Card;

    jest.spyOn(cardsServiceMock, 'findOne').mockReturnValue(card);

    const result = controller.findOne(id);

    expect(result).toEqual(card);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call CardsService.update', () => {
    const id = '1';
    const updateCardDto = { name: 'Name', link: '' } as UpdateCardDto;
    const card = { id: 0, name: 'Name' } as Card;

    jest.spyOn(cardsServiceMock, 'update').mockReturnValue(card);

    const result = controller.update(id, updateCardDto);

    expect(result).toEqual(card);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateCardDto);
  });

  it('.remove() should call CardsService.remove', async () => {
    const id = '1';
    const card = {
      id: 1,
      name: 'Name',
      link: '',
      userId: 0,
    } as Card;

    jest.spyOn(cardsServiceMock, 'remove').mockReturnValue(card);

    const result = controller.remove(id);

    expect(result).toEqual(card);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
