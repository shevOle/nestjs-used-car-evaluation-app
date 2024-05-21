import { ExecutionContext, CanActivate } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return !!request?.currentUser?.id;
  }
}
