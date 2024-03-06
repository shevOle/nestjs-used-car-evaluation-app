import { randomBytes } from 'crypto';
import { User } from 'src/db/entities/user.entity';

export const defaultEmail = 'email@test.com';
export const defaultPassword = 'password';
export const randomHashedPassword = randomBytes(24).toString('hex');

export const defaultUser: User = {
  id: 1,
  email: defaultEmail,
  password: defaultPassword,
  isAdmin: false,
  reports: [],
};

export const defaultReport = {
  make: 'toyota',
  model: 'corolla',
  year: 1980,
  lat: 1,
  lng: 2,
  mileage: 10000,
  price: 1000,
};
