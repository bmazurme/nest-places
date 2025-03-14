import { NestFactory } from '@nestjs/core';
// import { WinstonModule } from 'nest-winston';
// import { transports, format } from 'winston';
// import * as WinstonTelegram from 'winston-telegram';
import 'winston-daily-rotate-file';

import { AppModule } from './app.module';
import { loggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);

  app.enableCors();
  await app.listen(4000);
}
bootstrap();
