import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { scrypt } from 'crypto';
import { Secret, SignOptions, sign } from 'jsonwebtoken';
import { User } from 'src/db/entities/user.entity';
import { promisify } from 'util';

@Injectable()
export class UtilsService {
  cryptFunction: (
    password: string,
    secret: string,
    length: number,
  ) => Promise<Buffer>;
  signToken: (
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
  ) => Promise<string>;

  constructor(private config: ConfigService) {
    this.cryptFunction = promisify(scrypt);
    this.signToken = promisify(sign);
  }

  async prepareToken(user: User): Promise<string> {
    return this.signToken(
      {
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
      },
      'superSecretKey',
      { expiresIn: '1h' },
    );
  }

  async hashPassword(password: string): Promise<string> {
    const secret = this.config.get('SECRET');
    const hashedPassword = await this.cryptFunction(password, secret, 24);
    return hashedPassword.toString('hex');
  }
}
