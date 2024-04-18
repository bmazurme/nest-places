import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesService', () => {
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
      providers: [RolesService],
    })
      .overrideProvider(RolesService)
      .useValue(rolesServiceMock)
      .compile();

    service = module.get<RolesService>(RolesService);
  });

  it('.findAll() should call RolesService.findAll', () => {
    jest.spyOn(service, 'findAll');
    service.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('.create() should call RolesService.create', () => {
    const createRoleDto = { name: 'Name' } as CreateRoleDto;
    const role = { id: 0, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'create').mockReturnValue(role);

    const result = service.create(createRoleDto);

    expect(result).toEqual(role);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith({
      name: 'Name',
    });
  });

  it('.findOne() should call RolesService.findOne', () => {
    const id = '0';
    const role = { id: 0, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'findOne').mockReturnValue(role);

    const result = service.findOne(+id);

    expect(result).toEqual(role);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(0);
  });

  it('.update() should call RolesService.update', () => {
    const id = '1';
    const updateRoleDto = { name: 'Name' } as UpdateRoleDto;
    const role = { id: 0, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'update').mockReturnValue(role);

    const result = service.update(+id, updateRoleDto);

    expect(result).toEqual(role);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, updateRoleDto);
  });

  it('.remove() should call RolesService.remove', async () => {
    const id = '1';
    const role = { id: 1, name: 'Name' } as Role;

    jest.spyOn(rolesServiceMock, 'remove').mockReturnValue(role);

    const result = service.remove(+id);

    expect(result).toEqual(role);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(+id);
  });
});
