import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { SKIP_CSRF } from '../decorators/skip-csrf.decorator';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF, [
      context.getHandler(),
      context.getClass()
    ]);
    if (skip) return true;

    const req = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.includes(req.method)) return true;

    const cookieToken = req.cookies?.csrfToken;
    const headerToken = req.headers['x-csrf-token'];

    if (
      !cookieToken ||
      !headerToken ||
      typeof headerToken !== 'string' ||
      cookieToken !== headerToken
    ) {
      throw new ForbiddenException('Invalid or missing CSRF token');
    }

    return true;
  }
}