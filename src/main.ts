import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import * as WinstonTelegram from 'winston-telegram';
import 'winston-daily-rotate-file';

import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires

const option: WinstonTelegram.Options = {
  token: process.env.TELEGRAM_TOKEN,
  chatId: Number(process.env.TELEGRAM_CHAT_ID),
  level: 'error',
  // level: 'info',
  unique: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new WinstonTelegram(option),
        // file on daily rotation (error only)
        new transports.DailyRotateFile({
          // %DATE will be replaced by the current date
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  app.enableCors();
  await app.listen(4000);
}
bootstrap();
