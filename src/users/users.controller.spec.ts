import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const usersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .compile();

    controller = app.get<UsersController>(UsersController);
    service = app.get<UsersService>(UsersService);
  });

  it('.findAll() should call UsersService.findAll', () => {
    jest.spyOn(service, 'findAll');
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call UsersService.create', async () => {
    const createUserDto = { email: 'email@email.com' } as CreateUserDto;
    const user = {
      id: 0,
      name: 'Name',
      about: 'About',
      email: 'email@email.com',
    } as User;

    jest.spyOn(usersServiceMock, 'create').mockReturnValue(user);

    const result = await controller.create(createUserDto);

    expect(result).toEqual(user);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({
      email: 'email@email.com',
    });
  });

  it('.findOne() should call UsersService.findOne', async () => {
    const userData = { user: { id: 0 } } as { user: User };
    const user = {
      id: 0,
      name: 'Name',
      about: 'About',
      email: 'email@email.com',
    } as User;

    jest.spyOn(usersServiceMock, 'findOne').mockReturnValue(user);

    const result = await controller.findOne(userData);

    expect(result).toEqual(user);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call UsersService.update', async () => {
    const id = '1';
    const updateUserDto = {
      name: 'Name',
      about: 'About',
      email: 'email@email.com',
    } as UpdateUserDto;
    const user = {
      id: 0,
      name: 'Name',
      about: 'About',
      email: 'email@email.com',
      avatar: 'https://i.pravatar.cc/300',
    } as User;

    jest.spyOn(usersServiceMock, 'update').mockReturnValue(user);

    const result = controller.update(id, updateUserDto);

    expect(result).toEqual(user);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateUserDto);
  });
});
