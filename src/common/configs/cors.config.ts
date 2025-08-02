import { INestApplication } from '@nestjs/common';
// import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Конфигурация CORS для NestJS приложения
 *
 * Этот файл содержит настройки для управления междоменными запросами
 * и обеспечивает безопасное взаимодействие между фронтендом и бэкендом.
 */

export const configureCors = (app: INestApplication) => {
  app.enableCors({
    /**
     * Домены, с которых разрешены запросы
     * Используйте * для разрешения всех доменов в разработке
     */
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3005',
    ],

    /**
     * Разрешённые HTTP методы
     */
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],

    /**
     * Разрешённые HTTP заголовки
     */
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

    /**
     * Возможность отправки cookies в запросах
     */
    credentials: true,

    /**
     * Максимальное время жизни preflight-запросов
     */
    maxAge: 3600, // 1 час

    /**
     * Опциональная настройка для обработки OPTIONS запросов
     */
    optionsSuccessStatus: 204,
  });
};
