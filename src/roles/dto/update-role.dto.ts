import { PartialType } from '@nestjs/mapped-types';

import { CreateRoleDto } from './create-role.dto';

/**
 * Data Transfer Object for updating existing roles.
 * This class extends PartialType of CreateRoleDto, making all its properties optional.
 * Allows partial updates of role fields, where only provided fields will be updated.
 * Useful for scenarios where only specific role details need to be modified.
 *
 * Example usage:
 * - Updating role name
 * - Modifying role permissions
 * - Changing role description
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
