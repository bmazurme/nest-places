import { NestFactory } from '@nestjs/core';

import 'winston-daily-rotate-file';

import { AppModule } from './app.module';
import { loggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
