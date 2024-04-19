import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';

import { CreateUserRoleDto } from './create-user-role.dto';

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
  @IsNumber()
  id: number;
}
