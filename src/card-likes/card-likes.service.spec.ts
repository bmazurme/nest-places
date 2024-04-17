import { Test, TestingModule } from '@nestjs/testing';
import { CardLikesService } from './card-likes.service';

describe('CardLikesService', () => {
  let service: CardLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardLikesService],
    }).compile();

    service = module.get<CardLikesService>(CardLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
