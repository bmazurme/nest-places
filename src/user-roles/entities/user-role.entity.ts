import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class UserRole extends BaseEntity {
  @Column()
  public userId: number;

  @Column()
  public roleId: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  public user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  public role: Role;
}
