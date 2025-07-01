import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';

import { CreateCardTagDto } from './create-card-tag.dto';

/**
 * Data Transfer Object for updating an existing card-tag relationship.
 * This class extends PartialType of CreateCardTagDto, making all its properties optional.
 * Additionally, it includes a mandatory 'id' field to identify the existing relationship to update.
 */
export class UpdateCardTagDto extends PartialType(CreateCardTagDto) {
  /**
   * Unique identifier of the card-tag relationship to update
   * @type {number}
   * @description Primary key used to identify the specific relationship record in the database
   * @example 123
   * @pattern ^\d+$
   * @isRequired
   */
  @IsNumber()
  id: number;
}
