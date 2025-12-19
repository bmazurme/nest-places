import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UsersService } from '../users/users.service';

const mockUsersService = {
  findOne: jest.fn(),
  findByAvatar: jest.fn(),
  updateAvatar: jest.fn(),
};

const mockFilesService = {
  uploadFile: jest.fn(),
  resizeAndCopyImage: jest.fn(),
  removeFile: jest.fn(),
  getAvatarFile: jest.fn(),
  getSlide: jest.fn(),
  getCover: jest.fn(),
  updateAvatar: jest.fn(),
};

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: 'MINIO_CLIENT',
          useValue: {
            putObject: jest.fn(),
            getObject: jest.fn(),
            removeObject: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should call FilesService.uploadFile', async () => {
      const file = {
        originalname: 'test.jpg',
        buffer: Buffer.from('file-content'),
        size: 100,
      } as Express.Multer.File;

      mockFilesService.uploadFile.mockResolvedValue({ etag: '123' });

      await controller.uploadFile(file);

      expect(service.uploadFile).toHaveBeenCalledWith(file);
    });
  });
});
