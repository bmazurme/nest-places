import { Test, TestingModule } from '@nestjs/testing';

import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { UserRole } from './entities/user-role.entity';

import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

describe('UserRolesController', () => {
  let controller: UserRolesController;
  let service: UserRolesService;

  const userRolesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [UserRolesService],
    })
      .overrideProvider(UserRolesService)
      .useValue(userRolesServiceMock)
      .compile();

    controller = module.get<UserRolesController>(UserRolesController);
    service = module.get<UserRolesService>(UserRolesService);
  });

  it('.create() should call UserRolesController.create', () => {
    const createUserRoleDto = {
      id: 0,
      userId: 1,
      roleId: 2,
    } as unknown as CreateUserRoleDto;
    const userRole = { id: 0, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'create').mockReturnValue(userRole);

    const result = controller.create(createUserRoleDto);

    expect(result).toEqual({
      id: 0,
      userId: 1,
      roleId: 2,
    });
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({
      id: 0,
      userId: 1,
      roleId: 2,
    });
  });

  it('.findOne() should call UserRolesController.findOne', () => {
    const id = '0';
    const userRole = { id: 0, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'findOne').mockReturnValue(userRole);

    const result = controller.findOne(id);

    expect(result).toEqual(userRole);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call UserRolesController.update', () => {
    const id = '1';
    const updateTagDto = {
      userId: 1,
      roleId: 2,
    } as unknown as UpdateUserRoleDto;
    const userRole = { id: 1, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'update').mockReturnValue(userRole);

    const result = controller.update(id, updateTagDto);

    expect(result).toEqual(userRole);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateTagDto);
  });

  it('.remove() should call UserRolesController.remove', async () => {
    const id = '0';
    const userRole = { id: 0, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'remove').mockReturnValue(userRole);

    const result = controller.remove(id);

    expect(result).toEqual(userRole);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
