import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { unlink } from 'fs';

import { User } from '../users/entities/user.entity';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File) {
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
}
