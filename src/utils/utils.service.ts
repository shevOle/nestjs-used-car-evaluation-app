import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { scrypt } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/db/entities/user.entity';
import { promisify } from 'util';

@Injectable()
export class UtilsService {
  secret = 'superSecretKey';
  cryptFunction: (
    password: string,
    secret: string,
    length: number,
  ) => Promise<Buffer>;

  constructor(private config: ConfigService) {
    this.cryptFunction = promisify(scrypt);
  }

  private signJWT(payload: string | Buffer | object): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = sign(payload, this.secret, { expiresIn: '1h' });
        return resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  private verifyJWT(token: string): Promise<string | Buffer | object> {
    return new Promise((resolve, reject) => {
      try {
        const payload = verify(token, this.secret, { complete: false });
        return resolve(payload);
      } catch (err) {
        reject(err);
      }
    });
  }

  async prepareToken(user: User): Promise<string> {
    return this.signJWT({
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
    });
  }

  async verifyToken(token: string) {
    return this.verifyJWT(token);
  }

  async hashPassword(password: string): Promise<string> {
    const secret = this.config.get('SECRET');
    const hashedPassword = await this.cryptFunction(password, secret, 24);
    return hashedPassword.toString('hex');
  }
}
