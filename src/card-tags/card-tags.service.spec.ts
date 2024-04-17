import { Test, TestingModule } from '@nestjs/testing';
import { CardTagsService } from './card-tags.service';

describe('CardTagsService', () => {
  let service: CardTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardTagsService],
    }).compile();

    service = module.get<CardTagsService>(CardTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
