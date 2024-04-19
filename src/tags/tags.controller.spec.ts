import { Test, TestingModule } from '@nestjs/testing';

import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

describe('TagsController', () => {
  let controller: TagsController;
  let tagsService: TagsService;

  const tagsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [TagsService],
    })
      .overrideProvider(TagsService)
      .useValue(tagsServiceMock)
      .compile();

    controller = module.get<TagsController>(TagsController);
    tagsService = module.get<TagsService>(TagsService);
  });

  it('.findAll() should call TagsController.findAll', () => {
    jest.spyOn(tagsService, 'findAll');
    controller.findAll();
    expect(tagsService.findAll).toHaveBeenCalled();
  });

  it('.create() should call TagsController.create', () => {
    const createTagDto = { name: 'Name' } as CreateTagDto;
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'create').mockReturnValue(tag);

    const result = controller.create(createTagDto);

    expect(result).toEqual(tag);
    expect(tagsService.create).toHaveBeenCalled();
    expect(tagsService.create).toHaveBeenCalledWith({ name: 'Name' });
  });

  it('.findOne() should call TagsController.findOne', () => {
    const id = '0';
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'findOne').mockReturnValue(tag);

    const result = controller.findOne(id);

    expect(result).toEqual(tag);
    expect(tagsServiceMock.findOne).toHaveBeenCalled();
    expect(tagsServiceMock.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call TagsController.update', () => {
    const id = '1';
    const updateTagDto = { name: 'Name' } as UpdateTagDto;
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'update').mockReturnValue(tag);

    const result = controller.update(id, updateTagDto);

    expect(result).toEqual(tag);
    expect(tagsService.update).toHaveBeenCalled();
    expect(tagsService.update).toHaveBeenCalledWith(+id, updateTagDto);
  });

  it('.remove() should call TagsController.remove', async () => {
    const id = '1';
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'remove').mockReturnValue(tag);

    const result = controller.remove(id);

    expect(result).toEqual(tag);
    expect(tagsService.remove).toHaveBeenCalled();
    expect(tagsService.remove).toHaveBeenCalledWith(+id);
  });
});
