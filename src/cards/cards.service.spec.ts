import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import promClient from 'prom-client';

import { CardsService } from './cards.service';
import { LikesService } from '../likes/likes.service';
import { TagsService } from '../tags/tags.service';
import { FilesService } from '../files/files.service';

import { Card } from './entities/card.entity';
import { User } from '../users/entities/user.entity';
import { CreateCardDto } from './dto/create-card.dto';

const mockCounter = {
  inc: jest.fn(),
};

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'password',
  name: 'Test User',
} as unknown as User;

const mockCard: Card = {
  id: 1,
  name: 'Test Card',
  link: 'test.webp',
  user: mockUser,
} as Card;

const mockCardRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  countBy: jest.fn(),
  query: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue(mockCard),
  }),
};

const mockLikesService = {
  like: jest.fn(),
  dislike: jest.fn(),
};

const mockTagsService = {
  findByNameOrCreate: jest.fn(),
};

const mockFilesService = {
  resizeAndCopyImage: jest.fn(),
  removeFile: jest.fn(),
};

describe('CardsService', () => {
  let service: CardsService;
  // let cardRepository: Repository<Card>;

  beforeEach(async () => {
    // const promClient = require('prom-client');
    promClient.register.clear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardRepository,
        },
        {
          provide: LikesService,
          useValue: mockLikesService,
        },
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: 'cards_get_total',
          useValue: mockCounter,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    // cardRepository = module.get<Repository<Card>>(getRepositoryToken(Card));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create card with valid data', async () => {
      const createCardDto: CreateCardDto = {
        name: 'New Card',
        link: 'image.jpg',
        tagName: 'test',
        user: new User(),
      };

      mockTagsService.findByNameOrCreate.mockResolvedValue({ id: 1 });
      mockFilesService.resizeAndCopyImage.mockResolvedValue(undefined);
      mockCardRepository.save.mockResolvedValue(mockCard);

      const result = await service.create(createCardDto, mockUser);

      expect(mockTagsService.findByNameOrCreate).toHaveBeenCalledWith('test');
      expect(mockFilesService.resizeAndCopyImage).toHaveBeenCalledWith(
        'image.jpg',
      );
      expect(mockCardRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCard);
    });

    it('should throw BadRequestException for invalid card data', async () => {
      await expect(service.create(null, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(
        service.create({ name: '', link: '' } as CreateCardDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if image processing fails', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Card with bad image',
        link: 'broken.jpg',
        tagName: 'test',
        user: new User(),
      };

      mockTagsService.findByNameOrCreate.mockResolvedValue({ id: 1 });
      mockFilesService.resizeAndCopyImage.mockRejectedValue(
        new Error('Image processing failed'),
      );

      await expect(service.create(createCardDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockFilesService.resizeAndCopyImage).toHaveBeenCalledWith(
        'broken.jpg',
      );
    });

    it('should throw InternalServerErrorException if DB save fails', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Card with DB error',
        link: 'image.jpg',
        tagName: 'test',
        user: new User(),
      };

      mockTagsService.findByNameOrCreate.mockResolvedValue({ id: 1 });
      mockFilesService.resizeAndCopyImage.mockResolvedValue(undefined);
      mockCardRepository.save.mockRejectedValue(new Error('DB save failed'));

      await expect(service.create(createCardDto, mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
