import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Tag } from '../tags/entities/tag.entity';
import { Role } from '../roles/entities/role.entity';
import { Like } from '../likes/entities/like.entity';
import { Card } from '../cards/entities/card.entity';
import { CardTag } from '../card-tags/entities/card-tag.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../user-roles/entities/user-role.entity';

export const TypeOrmModuleConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST') ?? 'localhost',
    port: +configService.get('POSTGRES_PORT') || 5432,
    username: configService.get('POSTGRES_USER') ?? 'postgres',
    password: configService.get('POSTGRES_PASSWORD') ?? 'newPassword',
    database: configService.get('POSTGRES_DB') ?? 'nestplaces',
    entities: [User, UserRole, Tag, Role, Like, Card, CardTag],
    synchronize: true,
  }),
  inject: [ConfigService],
});
