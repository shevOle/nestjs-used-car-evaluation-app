import { ExecutionContext, CanActivate } from '@nestjs/common';

export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return !!request?.currentUser?.isAdmin;
  }
}
