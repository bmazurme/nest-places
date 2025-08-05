import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { FilesService } from './files.service';
import { JwtGuard } from '../common/guards/jwt.guard';

import { User } from '../users/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Controller for managing file operations.
 * Handles file upload and deletion operations.
 * Requires JWT authentication for all endpoints.
 */
// @UseGuards(JwtGuard)
@Controller('files')
export class FilesController {
  /**
   * Constructor initializing service dependencies
   * @param filesService Service for handling file operations
   */
  constructor(private readonly filesService: FilesService) {}

  /**
   * Deletes a file by name
   * @param name Name of the file to delete
   * @param req Request object containing authenticated user
   * @returns Deletion result
   * @swagger
   * operationId: deleteFile
   * responses:
   * 200:
   * description: File deleted successfully
   * 401:
   * description: Unauthorized
   * 404:
   * description: File not found
   */
  @UseGuards(JwtGuard)
  @Delete(':name')
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'File not found' })
  remove(@Param('name') name: string, @Req() req: { user: User }) {
    return this.filesService.removeFile(name, req.user);
  }

  /**
   * Uploads a new file
   * @param file Uploaded file object
   * @returns Uploaded file details
   * @swagger
   * operationId: uploadFile
   * responses:
   * 201:
   * description: File uploaded successfully
   * content:
   * application/json:
   * schema:
   * $ref: '#/components/schemas/File'
   * 401:
   * description: Unauthorized
   * 400:
   * description: Invalid file
   */
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }

  @Get('avatar/:fileName')
  async getAvatarFile(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    return this.filesService.getAvatarFile(fileName, response);
  }

  @Get('covers/:coverName')
  async getCoverFile(
    @Param('coverName') coverName: string,
    @Res() response: Response,
  ) {
    return this.filesService.getCoverFile(coverName, response);
  }

  @Get(':fileName')
  async getFile(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    return this.filesService.getFile(fileName, response);
  }
}
