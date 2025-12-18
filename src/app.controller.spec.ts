import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          // Токен, который NestJS ищет для метрики 'get_hello_calls'
          provide: 'PROM_METRIC_GET_HELLO_CALLS',
          useValue: {
            // Мокируем метод inc() — достаточно пустой функции для теста
            inc: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const controller = app.get(AppController);
      const result = controller.getHello();
      expect(result).toBe('Hello World!');
    });
  });
});
