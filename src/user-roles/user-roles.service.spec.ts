import { Test, TestingModule } from '@nestjs/testing';

import { UserRolesService } from './user-roles.service';
import { UserRole } from './entities/user-role.entity';

import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

describe('UserRolesService', () => {
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
      providers: [UserRolesService],
    })
      .overrideProvider(UserRolesService)
      .useValue(userRolesServiceMock)
      .compile();

    service = module.get<UserRolesService>(UserRolesService);
  });

  it('.create() should call UserRolesService.create', () => {
    const createTagDto = {
      userId: 1,
      roleId: 2,
    } as unknown as CreateUserRoleDto;
    const userRole = { id: 0, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'create').mockReturnValue(userRole);

    const result = service.create(createTagDto);

    expect(result).toEqual(userRole);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({
      userId: 1,
      roleId: 2,
    });
  });

  it('.findOne() should call UserRolesService.findOne', () => {
    const id = '0';
    const userRole = { id: 0, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'findOne').mockReturnValue(userRole);

    const result = service.findOne(+id);

    expect(result).toEqual(userRole);
    expect(userRolesServiceMock.findOne).toHaveBeenCalled();
    expect(userRolesServiceMock.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call UserRolesService.update', () => {
    const id = '1';
    const updateUserRoleDto = {
      userId: 1,
      roleId: 2,
    } as unknown as UpdateUserRoleDto;
    const userRole = { id: 1, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'update').mockReturnValue(userRole);

    const result = service.update(+id, updateUserRoleDto);

    expect(result).toEqual(userRole);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateUserRoleDto);
  });

  it('.remove() should call UserRolesService.remove', async () => {
    const id = '0';
    const userRole = { id: 0, userId: 1, roleId: 2 } as UserRole;

    jest.spyOn(userRolesServiceMock, 'remove').mockReturnValue(userRole);

    const result = service.remove(+id);

    expect(result).toEqual(userRole);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
