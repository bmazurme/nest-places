import {
  Injectable,
  InternalServerErrorException,
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
  }

  async resizeAndCopyImage(filename: string) {
    try {
      const fileStream = await this.minioService.getObject(
        this._bucketTmp,
        filename,
      );

      const buffer = await streamToBuffer(fileStream);

      const cover = await sharp(buffer)
        .toFormat('webp')
        .resize(564, 564)
        .toBuffer();

      const slide = await sharp(buffer)
        .toFormat('webp')
        .resize(1000, 1000)
        .toBuffer();

      await this.minioService.putObject(this._bucketCovers, filename, cover);
      await this.minioService.putObject(this._bucketSlides, filename, slide);

      return { filename };
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      throw new InternalServerErrorException(
        'Произошла ошибка при обработке изображения',
      );
    }
  }

  async removeFile(name: string) {
    await this.minioService.removeObject(this._bucketCovers, name);
    await this.minioService.removeObject(this._bucketSlides, name);

    return `This action removes a #${name} file`;
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

      // Обновляем информацию об аватаре в базе данных
      await this.usersService.updateAvatar(current);

      return current;
    } catch (error) {
      // Обработка ошибок (можно добавить логирование)
      throw new InternalServerErrorException(
        'Ошибка при обработке или сохранении аватара',
      );
    }
  }
}
