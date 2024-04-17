import { PartialType } from '@nestjs/mapped-types';
import { CreateCardLikeDto } from './create-card-like.dto';

export class UpdateCardLikeDto extends PartialType(CreateCardLikeDto) {}
