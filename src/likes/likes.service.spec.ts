import { Test, TestingModule } from '@nestjs/testing';

import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';

describe('LikesService', () => {
  let service: LikesService;

  const likesServiceMock = {
    like: jest.fn(),
    dislike: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikesService],
    })
      .overrideProvider(LikesService)
      .useValue(likesServiceMock)
      .compile();

    service = module.get<LikesService>(LikesService);
  });

  it('.create() should call LikesService.create', () => {
    const createLikeDto = { card: { id: 1 }, user: { id: 1 } } as CreateLikeDto;
    const like = { id: 0 } as Like;

    jest.spyOn(likesServiceMock, 'like').mockReturnValue(like);

    const result = service.like(createLikeDto);

    expect(result).toEqual(like);
    expect(service.like).toHaveBeenCalled();
    expect(service.like).toHaveBeenCalledWith({
      card: { id: 1 },
      user: { id: 1 },
    });
  });

  it('.remove() should call LikesService.remove', async () => {
    const like = { id: 1 } as Like;

    jest.spyOn(likesServiceMock, 'dislike').mockReturnValue(like);

    const result = service.dislike(like);

    expect(result).toEqual(like);
    expect(service.dislike).toHaveBeenCalled();
    expect(service.dislike).toHaveBeenCalledWith(like);
  });
});
