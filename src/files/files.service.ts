import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync, unlink } from 'fs';
import * as sharp from 'sharp';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FilesService {
  private readonly coversPath = 'covers';
  private readonly slidesPath = 'slides';

  constructor(private readonly usersService: UsersService) {}

  async uploadFile(file: Express.Multer.File) {
    const targetPath = join(__dirname, '..', '..', 'uploads', 'target');
    const coverPath = join(__dirname, '..', '..', 'uploads', 'covers');

    const fileName = `${Date.now()}-${file.originalname.replace(file.originalname.split('.')[file.originalname.split('.').length - 1], 'webp')}`;
    const fileSourcePath = join(targetPath, fileName);
    const fileCoverPath = join(coverPath, fileName);

    if (!existsSync(targetPath)) {
      mkdirSync(targetPath);
    }

    if (!existsSync(coverPath)) {
      mkdirSync(coverPath);
    }

    await sharp(file.buffer)
      .toFormat('webp')
      .resize(564, 564)
      .toFile(fileCoverPath);

    await sharp(file.buffer)
      .toFormat('webp')
      .resize(1000, 1000)
      .toFile(fileSourcePath);

    return { message: 'File uploaded successfully', link: file.filename };
  }

  removeFile(name: string, user: User) {
    const folder = user.id.toString();
    const folderCovers = join(__dirname, '..', '..', 'uploads', folder, name);

    unlink(folderCovers, (err) => {
      if (err) {
        console.error(`Error removing file: ${err}`);
        return;
      }
    });

    return `This action removes a #${name} file`;
  }

  async getAvatarFile(fileName: string, response: Response) {
    // const user = await this.usersService.findByAvatar(fileName);

    // if (!user) {
    //   return new NotFoundException();
    // }

    response
      .set('Cache-Control', 'public, max-age=31557600')
      .sendFile(join(__dirname, '..', '..', 'uploads', 'avatars', fileName));
  }

  async getCoverFile(fileName: string, response: Response) {
    response
      .set('Cache-Control', 'public, max-age=31557600')
      .sendFile(join(__dirname, '..', '..', 'uploads', 'covers', fileName));
  }

  async getFile(fileName: string, response: Response) {
    response
      .set('Cache-Control', 'public, max-age=31557600')
      .sendFile(join(__dirname, '..', '..', 'uploads', 'target', fileName));
  }

  //   export const getCoverFile = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const card = await Card.findOne({ where: { link: req.params.filename } });

  //     if (!card) {
  //       return next(new NotFoundError('File not found'));
  //     }

  //     res
  //       .setHeader('Cache-Control', 'public, max-age=86400')
  //       .sendFile(path.join(__dirname, '..', '..', 'uploads', 'covers', card.link));
  //   } catch (error: unknown) {
  //     if ((error as Error).name === 'CastError') {
  //       return next(new BadRequestError('bad request'));
  //     }

  //     next(error);
  //   }
  // };
}
