import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { Readable } from 'stream';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { User } from '../users/entities/user.entity';

const mockFilesService = {
  removeFile: jest.fn(),
  uploadFile: jest.fn(),
  getAvatarFile: jest.fn(),
  getCover: jest.fn(),
  resizeAndCopyImage: jest.fn(),
  getSlide: jest.fn(),
  updateAvatar: jest.fn(),
};

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'password',
  role: 'user',
} as unknown as User;

const mockResponse: Response = {
  sendFile: jest.fn(),
  setHeader: jest.fn(),
} as unknown as Response;

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: JwtGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);

    jest.clearAllMocks();
  });

  describe('remove', () => {
    it('should call filesService.removeFile with correct filename', async () => {
      const filename = 'test.jpg';

      await controller.remove(filename);

      expect(filesService.removeFile).toHaveBeenCalledWith(filename);
      expect(filesService.removeFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('uploadFile', () => {
    it('should call filesService.uploadFile with uploaded file', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('file-content'),
        size: 100,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };

      await controller.uploadFile(mockFile);

      expect(filesService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(filesService.uploadFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAvatarFile', () => {
    it('should call filesService.getAvatarFile with filename and response', async () => {
      const filename = 'avatar.jpg';

      await controller.getAvatarFile(filename, mockResponse);

      expect(filesService.getAvatarFile).toHaveBeenCalledWith(
        filename,
        mockResponse,
      );
      expect(filesService.getAvatarFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCoverFile', () => {
    it('should call filesService.getCover with coverName and response', async () => {
      const coverName = 'cover.jpg';

      await controller.getCoverFile(coverName, mockResponse);

      expect(filesService.getCover).toHaveBeenCalledWith(
        coverName,
        mockResponse,
      );
      expect(filesService.getCover).toHaveBeenCalledTimes(1);
    });
  });

  describe('copyCoverFile', () => {
    it('should call filesService.resizeAndCopyImage with coverName', async () => {
      const coverName = 'cover.jpg';

      const result = await controller.copyCoverFile(coverName);

      expect(filesService.resizeAndCopyImage).toHaveBeenCalledWith(coverName);
      expect(filesService.resizeAndCopyImage).toHaveBeenCalledTimes(1);
      expect(result).toBe('ok');
    });
  });

  describe('getFile', () => {
    it('should call filesService.getSlide with filename and response', async () => {
      const filename = 'slide.jpg';

      await controller.getFile(filename, mockResponse);

      expect(filesService.getSlide).toHaveBeenCalledWith(
        filename,
        mockResponse,
      );
      expect(filesService.getSlide).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateAvatar', () => {
    it('should call filesService.updateAvatar with file and user', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'files',
        originalname: 'new-avatar.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('avatar-content'),
        size: 200,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };

      const req = { user: mockUser };

      await controller.updateAvatar(mockFile, req);

      expect(filesService.updateAvatar).toHaveBeenCalledWith(
        mockFile,
        mockUser,
      );
      expect(filesService.updateAvatar).toHaveBeenCalledTimes(1);
    });
  });
});
