import { IsNumber, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for creating a relationship between a card and a tag.
 * This class represents an object used for transferring data between application layers.
 * It contains two optional numeric fields: cardId and tagId.
 */
export class CreateCardTagDto {
  /**
   * Card identifier
   * @type {number}
   * @description Unique identifier of the card within the system
   * @example 123
   * @pattern ^\d+$
   * @isOptional
   */
  @IsNumber()
  @IsOptional()
  cardId: number;

  /**
   * Tag identifier
   * @type {number}
   * @description Unique identifier of the tag within the system
   * @example 456
   * @pattern ^\d+$
   * @isOptional
   */
  @IsNumber()
  @IsOptional()
  tagId: number;
}
