import { PartialType } from '@nestjs/mapped-types';

import { CreateCardDto } from './create-card.dto';

/**
 * Data Transfer Object for updating an existing card.
 * This class extends PartialType of CreateCardDto, making all its properties optional.
 * Allows partial updates of card fields, where only provided fields will be updated.
 */
export class UpdateCardDto extends PartialType(CreateCardDto) {}
