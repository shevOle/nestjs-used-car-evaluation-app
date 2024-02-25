import { hashPassword } from './hashPassword.helper';

const defaultPassword = 'password';

it('[hashPassword], password hashing returns a valid hash', async () => {
    const hash = await hashPassword(defaultPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(defaultPassword);
})