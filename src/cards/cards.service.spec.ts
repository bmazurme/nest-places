import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';

describe('CardsService', () => {
  let service: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
