import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../db/entities/user.entity';
import { UtilsService } from 'src/utils/utils.service';

interface RequestWithCurrentUser extends Request {
  currentUser?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UsersService,
    private utilsService: UtilsService,
  ) {}

  async use(req: RequestWithCurrentUser, _: never, next: NextFunction) {
    const { token } = req.cookies;
    let email: string;

    if (!token) return next();

    try {
      const payload = (await this.utilsService.verifyToken(token)) as any;
      email = payload.email;

      if (!email) throw new Error('No email provided');

      const user = await this.userService.findByEmail(email);
      req.currentUser = user;
    } catch (err) {
      console.error(`Cannot find a user with email ${email}`, err);
    }

    return next();
  }
}
