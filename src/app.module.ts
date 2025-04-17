import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OAuthModule } from './oauth/oauth.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { CardsModule } from './cards/cards.module';
import { LikesModule } from './likes/likes.module';
import { CardTagsModule } from './card-tags/card-tags.module';
import { RolesModule } from './roles/roles.module';
import { UserRolesModule } from './user-roles/user-roles.module';

import { TypeOrmModuleConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModuleConfig,
    OAuthModule,
    UsersModule,
    TagsModule,
    CardsModule,
    LikesModule,
    CardTagsModule,
    RolesModule,
    UserRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
