import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== 'manhwa-secret-123') {
      throw new UnauthorizedException(
        'Acceso denegado: falta el header x-api-key válido.',
      );
    }
    return true;
  }
}