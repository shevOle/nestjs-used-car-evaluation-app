import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../db/entities/user.entity';

interface RequestWithCurrentUser extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: RequestWithCurrentUser, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      try {
        const user = await this.userService.findById(userId);
        req.currentUser = user;
      } catch (err) {
        console.error(`Cannot find a user with id ${userId}`, err);
      }
    }

    return next();
  }
}
