import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';

describe('LikesService', () => {
  let service: LikesService;

  const likesServiceMock = {
    create: jest.fn(),
    remove: jest.fn(),
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
    const createLikeDto = { name: 'Name' } as CreateLikeDto;
    const like = { id: 0 } as Like;

    jest.spyOn(likesServiceMock, 'create').mockReturnValue(like);

    const result = service.create(createLikeDto);

    expect(result).toEqual(like);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({ name: 'Name' });
  });

  it('.remove() should call LikesService.remove', async () => {
    const id = '1';
    const like = { id: 0 } as Like;

    jest.spyOn(likesServiceMock, 'remove').mockReturnValue(like);

    const result = service.remove(+id);

    expect(result).toEqual(like);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
