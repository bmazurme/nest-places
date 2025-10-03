import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import * as sharp from 'sharp';
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
  protected _bucketAvatars = 'slides';

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

  removeFile(name: string, user: User) {
    // const folder = user.id.toString();
    // const folderCovers = join(__dirname, '..', '..', 'uploads', folder, name);

    // unlink(folderCovers, (err) => {
    //   if (err) {
    //     console.error(`Error removing file: ${err}`);
    //     return;
    //   }
    // });

    return `This action removes a #${name} file`;
  }

  async getAvatarFile(fileName: string, response: Response) {
    const user = await this.usersService.findByAvatar(fileName);

    if (!user) {
      return new NotFoundException();
    }

    const fileStream = await this.minioService.getObject(
      this._bucketAvatars,
      fileName,
    );

    response.set({
      'Content-Type': 'image/jpeg', // или другой тип вашего изображения
    });

    fileStream.pipe(response);
  }

  async getSlide(filename: string, response: Response) {
    const fileStream = await this.minioService.getObject(
      this._bucketSlides,
      filename,
    );

    response.set({
      'Content-Type': 'image/jpeg', // или другой тип вашего изображения
    });

    fileStream.pipe(response);
  }
  async getCover(filename: string, response: Response) {
    const fileStream = await this.minioService.getObject(
      this._bucketCovers,
      filename,
    );

    response.set({
      'Content-Type': 'image/jpeg',
    });

    fileStream.pipe(response);
  }

  async updateAvatar(file: Express.Multer.File, user: User) {
    const current = await this.usersService.findOne(user.id);
    const filename = `${randomUUID().toString()}-${file.originalname}`;
    current.avatar = filename;
    const buffer = file.buffer;

    const avatar = await sharp(buffer)
      .toFormat('webp')
      .resize(240, 240)
      .toBuffer();

    await this.minioService.putObject(this._bucketAvatars, filename, avatar);
    await this.usersService.updateAvatar(current);

    return current;
  }
}
