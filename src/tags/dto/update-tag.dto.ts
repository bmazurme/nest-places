import { PartialType } from '@nestjs/mapped-types';

import { CreateTagDto } from './create-tag.dto';

/**
 * Data Transfer Object for updating existing tags.
 * This class extends PartialType of CreateTagDto, making all its properties optional.
 * Allows partial updates of tag fields, where only provided fields will be modified.
 * Useful for scenarios where only specific tag details need to be changed.
 */
export class UpdateTagDto extends PartialType(CreateTagDto) {}
