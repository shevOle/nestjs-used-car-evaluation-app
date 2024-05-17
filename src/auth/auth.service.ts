import { Injectable, BadRequestException } from '@nestjs/common';

import { CreateUserRequestDto } from './dtos/create-user.request.dto';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private utilsService: UtilsService,
  ) {}

  async signup({
    email,
    password,
    profilePicture,
  }: CreateUserRequestDto): Promise<string> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('This email is already in use');
    }

    const hashedPassword = await this.utilsService.hashPassword(password);
    const user = await this.userService.createUser(
      email,
      hashedPassword,
      profilePicture,
    );

    return this.utilsService.prepareToken(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    if (!user)
      throw new BadRequestException('Username or password is incorrect');

    const hashedPassword = await this.utilsService.hashPassword(password);
    const isPasswordCorrect = hashedPassword === user.password;
    if (!isPasswordCorrect)
      throw new BadRequestException('Username or password is incorrect');

    return this.utilsService.prepareToken(user);
  }
}
