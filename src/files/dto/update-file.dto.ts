import { PartialType } from '@nestjs/swagger';

import { CreateFileDto } from './create-file.dto';

/**
 * Data Transfer Object for updating existing files.
 * This class extends PartialType of CreateFileDto, making all its properties optional.
 * Allows partial updates of file fields, where only provided fields will be updated.
 * Useful for scenarios where only specific file details need to be modified.
 */
export class UpdateFileDto extends PartialType(CreateFileDto) {}
