import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { User } from '../users/entities/user.entity';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const userFolder = (req.user as User).id.toString();
          const targetPath = join(__dirname, '..', '..', 'uploads', userFolder);

          if (!existsSync(targetPath)) {
            mkdirSync(targetPath);
          }

          const path = `${userFolder}/${Date.now()}-${file.originalname}`;
          cb(null, path);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
