import { Test, TestingModule } from '@nestjs/testing';

import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';

import { CreateLikeDto } from './dto/create-like.dto';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  const likesServiceMock = {
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [LikesService],
    })
      .overrideProvider(LikesService)
      .useValue(likesServiceMock)
      .compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  it('.create() should call LikesService.create', () => {
    const createLikeDto = { name: 'Name' } as CreateLikeDto;
    const like = { id: 0 } as Like;

    jest.spyOn(likesServiceMock, 'create').mockReturnValue(like);

    const result = controller.create(createLikeDto);

    expect(result).toEqual(like);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({ name: 'Name' });
  });

  it('.remove() should call LikesService.remove', async () => {
    const id = '1';
    const like = { id: 0 } as Like;

    jest.spyOn(likesServiceMock, 'remove').mockReturnValue(like);

    const result = controller.remove(id);

    expect(result).toEqual(like);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
