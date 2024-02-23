import { 
    ExecutionContext, 
    NestInterceptor, 
    CallHandler,
    Injectable,
 } from "@nestjs/common";
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        const user = await this.userService.findById(userId);

        request.currentUser = user;

        return handler.handle();
    }
}