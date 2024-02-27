import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class UtilsService {
    cryptFunction: (password: string, secret: string, length: number) => Promise<Buffer>;
    
    constructor(private config: ConfigService) {
        this.cryptFunction = promisify(scrypt);
    }

    async hashPassword(password: string): Promise<string> {
        const secret = this.config.get('SECRET');
        const hashedPassword = await this.cryptFunction(password, secret, 24);
        return hashedPassword.toString('hex');
    }
}
