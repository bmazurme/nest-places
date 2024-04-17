import { PartialType } from '@nestjs/mapped-types';
import { CreateCardTagDto } from './create-card-tag.dto';

export class UpdateCardTagDto extends PartialType(CreateCardTagDto) {}
