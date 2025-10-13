import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import sharp from 'sharp';
import { Readable } from 'stream';

import { InjectMinio } from '../minio/minio.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger('UserService');

  protected _bucketName = 'main';
  protected _bucketTmp = 'tmp';
  protected _bucketCovers = 'covers';
  protected _bucketSlides = 'slides';
  protected _bucketAvatars = 'avatars';

  constructor(
    private readonly usersService: UsersService,
    @InjectMinio() private readonly minioService: Minio.Client,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    try {
      return new Promise((resolve, reject) => {
        const filename = `${randomUUID().toString()}-${file.originalname}`;

        this.minioService.putObject(
          this._bucketTmp,
          filename,
          file.buffer,
          file.size,
          (error, objInfo) => {
            if (error) {
              reject(error);
            } else {
              resolve({ ...objInfo, filename });
            }
          },
        );
      });
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);

      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async resizeAndCopyImage(filename: string) {
    try {
      const fileStream = await this.minioService.getObject(
        this._bucketTmp,
        filename,
      );

      const buffer = await streamToBuffer(fileStream);
      const metadata = await sharp(buffer).metadata();

      if (!metadata || !metadata.format) {
        throw new BadRequestException('Invalid image format');
      }

      const processingTasks = [
        this.processImage(buffer, 564, this._bucketCovers, 'cover', filename),
        this.processImage(buffer, 1000, this._bucketSlides, 'slide', filename)
      ];

      await Promise.all(processingTasks);

      return { filename: filename.replace('.jpg', '.webp') };
    } catch (error) {
      this.logger.error(`Error while processing image: ${error.message}`);

      throw new InternalServerErrorException(
        'Error while processing image',
      );
    }
  }

  async removeFile(name: string) {
    try {
      if (!name || typeof name !== 'string') {
        throw new BadRequestException('Invalid file name provided');
      }

      this.logger.log(`Starting file removal process for file: ${name}`);

      // Последовательное удаление файлов
      const promises = [
        this.minioService.removeObject(this._bucketCovers, name),
        this.minioService.removeObject(this._bucketSlides, name),
      ];

      // Ожидание выполнения всех операций
      await Promise.all(promises);

      this.logger.log(`File ${name} successfully removed from all buckets`);

      return `File #${name} has been successfully removed`;
    } catch (error) {
      this.logger.error(`Error removing file ${name}: ${error.message}`);

      // if (error instanceof MinioError) {
      //   throw new InternalServerErrorException(
      //     `MinIO error occurred while removing file: ${error.message}`,
      //   );
      // }

      throw new InternalServerErrorException(
        'Failed to remove file. Please try again later.',
      );
    }

  }

  async getAvatarFile(filename: string, response: Response) {
    try {
      // Проверяем существование аватара в базе данных
      const user = await this.usersService.findByAvatar(filename);

      if (!user) {
        return new NotFoundException();
      }

      // Получаем поток файла из Minio хранилища
      const fileStream = await this.minioService.getObject(
        this._bucketAvatars,
        filename,
      );

      // Устанавливаем необходимые заголовки ответа
      response.set({
        'Content-Type': 'image/jpeg', // Можно добавить проверку типа файла
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000', // Кэширование на год
      });

      // Передаем поток файла в ответ
      fileStream
        .pipe(response)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .on('error', (error) => {
          // Обработка ошибок при передаче потока
          response.status(500).send('Ошибка при получении аватара');
        })
        .on('finish', () => {
          // Логирование успешного завершения
          // logger.info(`Аватар ${fileName} успешно отправлен`);
        });
    } catch (error) {
      // Обработка ошибок
      switch (error.name) {
        case 'NotFoundException':
          return response.status(404).send('Аватар не найден');
        case 'NoSuchKey':
          return response.status(404).send('Файл аватара не существует');
        default:
          return response.status(500).send('Внутренняя ошибка сервера');
      }
    }
  }

  async getSlide(filename: string, response: Response) {
    try {
      const fileStream = await this.minioService.getObject(
        this._bucketSlides,
        filename,
      );

      // Устанавливаем необходимые заголовки ответа
      response.set({
        'Content-Type': 'image/jpeg', // Можно добавить проверку типа файла
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000', // Кэширование на год
      });

      // Передаем поток файла в ответ
      fileStream
        .pipe(response)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .on('error', (error) => {
          // Обработка ошибок при передаче потока
          response.status(500).send('Ошибка при получении файла');
        })
        .on('finish', () => {
          // Логирование успешного завершения
          // logger.info(`Файл ${filename} успешно отправлен`);
        });
    } catch (error) {
      // Обработка ошибок при получении объекта
      switch (error.code) {
        case 'NoSuchKey':
          return response.status(404).send('Слайд не найден');
        case 'BucketAlreadyExists':
          return response.status(500).send('Ошибка конфигурации хранилища');
        default:
          return response.status(500).send('Внутренняя ошибка сервера');
      }
    }
  }

  async getCover(filename: string, response: Response) {
    try {
      const fileStream = await this.minioService.getObject(
        this._bucketCovers,
        filename,
      );

      // Устанавливаем необходимые заголовки ответа
      response.set({
        'Content-Type': 'image/jpeg', // Можно добавить проверку типа файла
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000', // Кэширование на год
      });

      // Передаем поток файла в ответ
      fileStream
        .pipe(response)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .on('error', (error) => {
          // Обработка ошибок при передаче потока
          response.status(500).send('Ошибка при получении файла');
        })
        .on('finish', () => {
          // Логирование успешного завершения
          // logger.info(`Файл ${filename} успешно отправлен`);
        });
    } catch (error) {
      // Обработка ошибок при получении объекта
      switch (error.code) {
        case 'NoSuchKey':
          return response.status(404).send('Файл не найден');
        default:
          return response.status(500).send('Внутренняя ошибка сервера');
      }
    }
  }

  async updateAvatar(file: Express.Multer.File, user: User) {
    // Получаем текущего пользователя из базы данных
    const current = await this.usersService.findOne(user.id);

    // Генерируем уникальное имя файла с сохранением оригинального расширения
    const uniqueFilename = `${randomUUID().toString()}-${file.originalname}`;
    current.avatar = uniqueFilename;

    // Получаем буфер загруженного файла
    const buffer = file.buffer;

    try {
      // Обрабатываем изображение:
      // - конвертируем в формат WebP
      // - изменяем размер до 240x240 пикселей
      // - получаем обработанный буфер
      const avatar = await sharp(buffer)
        .toFormat('webp')
        .resize(240, 240)
        .toBuffer();

      // Сохраняем обработанное изображение в Minio
      await this.minioService.putObject(
        this._bucketAvatars,
        uniqueFilename,
        avatar,
      );

      await this.usersService.updateAvatar(current);

      return current;
    } catch (error) {
      this.logger.error(`Error update avatar: ${error.message}`);

      throw new InternalServerErrorException(
        'Ошибка при обработке или сохранении аватара',
      );
    }
  }

  private async processImage(
    buffer: Buffer,
    size: number,
    bucket: string,
    type: string,
    filename: string,
  ): Promise<{ buffer: Buffer; size: number; format: string }> {
    try {
      const processed = await sharp(buffer)
        .resize(size, size)
        .toFormat('webp')
        .toBuffer();

      await this.minioService.putObject(
        bucket,
        filename.replace('.jpg', '.webp'),
        processed,
      );

      return {
        buffer: processed,
        size: processed.length,
        format: 'webp'
      };
    } catch (error) {
      this.logger.error(
        `Error processing ${type} image: ${error.message}`,
        { error }
      );

      throw error;
    }
  }
}
