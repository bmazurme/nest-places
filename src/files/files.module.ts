import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
// import { existsSync, mkdirSync } from 'fs';
// import { join } from 'path';

// import { User } from '../users/entities/user.entity';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: async (req, file, cb) => {
    //       const userFolder = (req.user as User).id.toString();
    //       const targetPath = join(__dirname, '..', '..', 'uploads', userFolder);

    //       if (!existsSync(targetPath)) {
    //         mkdirSync(targetPath);
    //       }

    //       const path = `${userFolder}/${Date.now()}-${file.originalname}`;

    //       cb(null, path);
    //     },
    //   }),
    // }),
    MulterModule.register({
      storage: memoryStorage(), // Используем memoryStorage вместо diskStorage
      limits: { fileSize: 10 * 1024 * 1024 }, // ограничение в 10MB
      fileFilter: (req, file, cb) => {
        const imageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (imageTypes.includes(file.mimetype)) {
          return cb(null, true);
        }
        cb(new Error('Только изображения разрешены'), false);
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
