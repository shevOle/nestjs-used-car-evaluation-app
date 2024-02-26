import { scrypt } from 'crypto';
import { promisify } from 'util';
import { config } from 'dotenv';

config();
const scryptPromise = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = (await scryptPromise(password, process.env.SECRET, 24)) as Buffer;
    return hashedPassword.toString('hex');
}