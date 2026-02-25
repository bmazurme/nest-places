import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Role } from '../common/decorators/role.enum';
import { Reflector } from '@nestjs/core';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'password',
  role: 'user',
} as unknown as User;

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  // let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    // reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call usersService.create with correct params', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'newpass',
      } as CreateUserDto;

      await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      await controller.findAll();
      expect(usersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne (me)', () => {
    it('should call usersService.findOne with user id', async () => {
      await controller.findOne(mockUser);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should call usersService.findByEmail with email param', async () => {
      const email = 'test@example.com';

      await controller.findByEmail(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should call usersService.findOne with id param', async () => {
      const id = '2';

      await controller.findOneById(id);

      expect(usersService.findOne).toHaveBeenCalledWith(2);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call usersService.update with user data', async () => {
      const updateUserDto = { email: 'updated@example.com' } as UpdateUserDto;

      await controller.update(updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(updateUserDto);
      expect(usersService.update).toHaveBeenCalledTimes(1);
    });
  });

  // describe('remove', () => {
  //   it('should have Roles decorator with Admin role', () => {
  //     const roles = reflector.getAll<string[]>(
  //       'roles',
  //       UsersController.prototype.remove
  //     );

  //     expect(roles).toEqual([Role.Admin]);
  //   });
  // });
});
