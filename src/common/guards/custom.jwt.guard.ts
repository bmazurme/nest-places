import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class CustomJwtGuard implements CanActivate {
  private readonly logger = new Logger('UserService');
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // const authHeader = request.headers.authorization;
    const token = request.cookies?.access_token;

    request.userId = -1;

    // if (authHeader && authHeader.startsWith('Bearer ')) {
    // const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.userId = decoded.sub;
      this.logger.log(`User id ${decoded.sub} from decoded.sub`);
    } catch (e) {
      // Игнорируем ошибку, оставляя userId = -1
    }
    // }
    
    // Всегда разрешаем доступ
    return true;
  }
}
