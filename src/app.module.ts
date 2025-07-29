import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OAuthModule } from './oauth/oauth.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { CardsModule } from './cards/cards.module';
import { LikesModule } from './likes/likes.module';
import { RolesModule } from './roles/roles.module';

import { TypeOrmModuleConfig } from './config';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveStaticOptions: { index: false },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModuleConfig,
    OAuthModule,
    UsersModule,
    TagsModule,
    CardsModule,
    LikesModule,
    RolesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
