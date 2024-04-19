import { Test, TestingModule } from '@nestjs/testing';

import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

describe('TagsService', () => {
  let service: TagsService;

  const tagsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsService],
    })
      .overrideProvider(TagsService)
      .useValue(tagsServiceMock)
      .compile();

    service = module.get<TagsService>(TagsService);
  });

  it('.create() should call TagsService.create', () => {
    const createTagDto = { name: 'Name' } as CreateTagDto;
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'create').mockReturnValue(tag);

    const result = service.create(createTagDto);

    expect(result).toEqual(tag);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({ name: 'Name' });
  });

  it('.findOne() should call TagsService.findOne', () => {
    const id = '0';
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'findOne').mockReturnValue(tag);

    const result = service.findOne(+id);

    expect(result).toEqual(tag);
    expect(tagsServiceMock.findOne).toHaveBeenCalled();
    expect(tagsServiceMock.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call TagsService.update', () => {
    const id = '1';
    const updateTagDto = { name: 'Name' } as UpdateTagDto;
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'update').mockReturnValue(tag);

    const result = service.update(+id, updateTagDto);

    expect(result).toEqual(tag);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateTagDto);
  });

  it('.remove() should call TagsService.remove', async () => {
    const id = '1';
    const tag = { id: 0, name: 'Name' } as Tag;

    jest.spyOn(tagsServiceMock, 'remove').mockReturnValue(tag);

    const result = service.remove(+id);

    expect(result).toEqual(tag);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
