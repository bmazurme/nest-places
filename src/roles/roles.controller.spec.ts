import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const rolesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    })
      .overrideProvider(RolesService)
      .useValue(rolesServiceMock)
      .compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('.findAll() should call RolesController.findAll', () => {
    jest.spyOn(service, 'findAll');
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call RolesController.create', () => {
    const createRoleDto = { name: 'Name' } as CreateRoleDto;
    const role = { id: 0, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'create').mockReturnValue(role);

    const result = controller.create(createRoleDto);

    expect(result).toEqual(role);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({
      name: 'Name',
    });
  });

  it('.findOne() should call RolesController.findOne', () => {
    const id = '0';
    const role = { id: 0, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'findOne').mockReturnValue(role);

    const result = controller.findOne(id);

    expect(result).toEqual(role);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call RolesController.update', () => {
    const id = '1';
    const updateRoleDto = { name: 'Name' } as UpdateRoleDto;
    const role = { id: 0, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'update').mockReturnValue(role);

    const result = controller.update(id, updateRoleDto);

    expect(result).toEqual(role);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateRoleDto);
  });

  it('.remove() should call RolesController.remove', async () => {
    const id = '1';
    const role = { id: 1, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'remove').mockReturnValue(role);

    const result = controller.remove(id);

    expect(result).toEqual(role);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
